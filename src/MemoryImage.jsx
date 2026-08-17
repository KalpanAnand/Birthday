import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function MemoryImage({ url, position, id, setActiveMemory }) {
  const meshRef = useRef();
  const texture = useTexture(url);
  const [hovered, setHovered] = useState(false);

  // We want to scale it slightly when it's close to the camera (Z = 0 usually)
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Distance from camera to this plane along the Z axis
    const zDist = Math.abs(state.camera.position.z - meshRef.current.position.z);
    
    // Base scale based on proximity to camera
    let targetScale = 1;
    if (zDist < 10) {
      // Gently enlarge as it approaches camera
      targetScale = 1 + (10 - zDist) * 0.05;
    }
    
    // Add hover effect
    if (hovered) {
      targetScale *= 1.05;
    }

    // Smoothly interpolate scale
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
  });

  // Calculate aspect ratio to avoid stretching
  let w = 4;
  let h = 4;
  if (texture && texture.image) {
    const aspect = texture.image.width / texture.image.height;
    if (aspect > 1) {
      h = 4 / aspect;
    } else {
      w = 4 * aspect;
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setActiveMemory({ id, url });
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
