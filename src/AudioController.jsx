import React, { useEffect, useRef, useState } from 'react';

// Singleton for audio data so we don't have to pass it through a complex React context for R3F
export const audioData = {
  intensity: 0
};

export default function AudioController({ audioUrl, isPlaying }) {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.crossOrigin = "anonymous";
    }

    if (isPlaying) {
      // Initialize Web Audio API on first play
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      }

      // Resume context if needed
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      audioRef.current.play().catch(e => console.error("Audio play failed:", e));

      const updateData = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          // Calculate average intensity (low frequencies primarily for beat)
          let sum = 0;
          for (let i = 0; i < 20; i++) {
            sum += dataArrayRef.current[i];
          }
          const avg = sum / 20;
          // Normalize to 0-1 range roughly (max byte is 255)
          audioData.intensity = avg / 255;
        }
        animationFrameRef.current = requestAnimationFrame(updateData);
      };
      
      updateData();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        // Reset the audio to the beginning so it starts fresh next time they enter
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying, audioUrl]);

  return null; // This component doesn't render anything visible
}
