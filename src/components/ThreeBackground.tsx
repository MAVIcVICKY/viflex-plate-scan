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
      '#dc2626', // Red
      '#b91c1c', // Dark Red
      '#991b1b', // Darker Red
      '#7c2d12', // Red Brown
      '#a855f7', // Purple
      '#9333ea', // Dark Purple
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
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} color="#dc2626" />
      <pointLight position={[-5, 5, 5]} intensity={1.5} color="#b91c1c" />
      <pointLight position={[5, -5, 5]} intensity={1.5} color="#a855f7" />
      <pointLight position={[0, 0, -5]} intensity={1.0} color="#9333ea" />
      
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
    <div className="fixed inset-0 -z-50 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ 
          background: '#000000'
        }}
        gl={{ alpha: true, antialias: true }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  );
};