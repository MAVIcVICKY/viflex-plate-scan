import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingOrb = ({ position, scale, speed, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.3;
      meshRef.current.rotation.y += speed * 0.5;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 2) * 0.01;
      meshRef.current.position.x += Math.cos(state.clock.elapsedTime * speed * 1.5) * 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const BackgroundScene = () => {
  const orbs = useMemo(() => {
    const colors = [
      '#6366f1', // Indigo
      '#8b5cf6', // Violet
      '#a855f7', // Purple
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#3b82f6', // Blue
    ];

    return Array.from({ length: 6 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 3
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1.5,
      color: colors[i % colors.length],
      speed: 0.5 + Math.random() * 1,
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[-5, 5, 5]} intensity={1.2} color="#6366f1" />
      <pointLight position={[5, -5, 5]} intensity={1.2} color="#ec4899" />
      <pointLight position={[0, 0, -5]} intensity={0.8} color="#06b6d4" />
      
      {orbs.map((orb, index) => (
        <FloatingOrb
          key={index}
          position={orb.position}
          scale={orb.scale}
          color={orb.color}
          speed={orb.speed}
        />
      ))}
    </>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 opacity-30">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a0b2e 25%, #16213e 50%, #0f3460 75%, #0a1e3e 100%)'
        }}
        gl={{ alpha: true, antialias: true }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  );
};