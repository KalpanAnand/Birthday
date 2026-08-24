import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import MemoryImage from './MemoryImage';
import { audioData } from './AudioController';

const SPACING = 5; // Distance between images on Z axis

function Particles() {
  const points = useRef();
  
  // Create random particle positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = -Math.random() * 200; // z (spread deep into tunnel)
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.z += delta * 0.05;
      points.current.position.z += delta * 1; // particles drift towards camera
      if (points.current.position.z > 200) {
        points.current.position.z = 0; // reset
      }
    }
  });

  return (
    <Points ref={points} positions={particlesPosition} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function CameraController({ maxZ, onEndReached }) {
  const { camera } = useThree();
  const targetZ = useRef(0);
  
  useEffect(() => {
    const handleWheel = (e) => {
      // Move targetZ forward (more negative) on scroll down
      const scrollSpeed = 0.02 + (audioData.intensity * 0.05); // Speed up with music intensity
      targetZ.current -= e.deltaY * scrollSpeed;
      
      // Clamp targetZ
      targetZ.current = Math.min(0, Math.max(targetZ.current, maxZ));
    };

    window.addEventListener('wheel', handleWheel);
    
    // Also support touch scrolling for mobile
    let touchStartY = 0;
    const handleTouchStart = (e) => touchStartY = e.touches[0].clientY;
    const handleTouchMove = (e) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      const scrollSpeed = 0.05 + (audioData.intensity * 0.05);
      targetZ.current -= deltaY * scrollSpeed;
      targetZ.current = Math.min(0, Math.max(targetZ.current, maxZ));
      touchStartY = e.touches[0].clientY;
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [maxZ]);

  useFrame(() => {
    // Smoothly interpolate camera position to targetZ
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
    
    // Slight sway based on mouse position or time
    const time = performance.now() * 0.001;
    camera.position.x = Math.sin(time * 0.5) * 0.2;
    camera.position.y = Math.cos(time * 0.5) * 0.2;

    // Check if reached the end
    if (Math.abs(camera.position.z - maxZ) < 1) {
      onEndReached();
    }
  });

  return null;
}

export default function TunnelScene({ memories, setActiveMemory, onEndReached }) {
  const maxZ = -(memories.length * SPACING);

  // Distribute images along a hallway rather than a tube
  const positionedMemories = useMemo(() => {
    return memories.map((mem, index) => {
      // Calculate Z position
      const z = -(index + 1) * SPACING;
      
      // Place alternately on the left and right sides
      const isLeft = index % 2 === 0;
      
      // X distance from center (approx 3 to 4 units away)
      const isMobile = window.innerWidth <= 768;
      const xBase = isMobile ? (1.2 + Math.random() * 0.6) : (3 + Math.random() * 1.5);
      const x = isLeft ? -xBase : xBase;
      
      // Keep Y mostly near eye level (between -1 and 1)
      const y = (Math.random() - 0.5) * 2;
      
      return { ...mem, position: [x, y, z] };
    });
  }, [memories]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
        {/* Dark fog */}
        <fog attach="fog" args={['#000000', 5, 25]} />
        
        {/* Gentle lighting */}
        <ambientLight intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 0, 0]} intensity={1} color="#6ba6ff" distance={30} />
        
        <Particles />
        
        <CameraController maxZ={maxZ} onEndReached={onEndReached} />
        
        {positionedMemories.map((mem) => (
          <MemoryImage 
            key={mem.id}
            id={mem.id}
            url={mem.url}
            position={mem.position}
            setActiveMemory={setActiveMemory}
          />
        ))}
      </Canvas>
    </div>
  );
}
