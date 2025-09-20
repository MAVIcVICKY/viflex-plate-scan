import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedShape = ({ position, geometry, color, speed }: {
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  color: string;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.8;
      meshRef.current.rotation.z += speed * 0.6;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.8}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={position} scale={0.8}>
        <primitive object={geometry} />
        <MeshDistortMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          distort={0.3}
          speed={2}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  const shapes = useMemo(() => {
    const geometries = [
      new THREE.TorusKnotGeometry(1, 0.3, 64, 8),
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.OctahedronGeometry(1.5),
      new THREE.DodecahedronGeometry(1.3),
    ];

    const colors = [
      '#ff4444', // Red
      '#4444ff', // Blue  
      '#ff44ff', // Magenta
      '#44ffff', // Cyan
      '#ffff44', // Yellow
      '#ff8844', // Orange
    ];

    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      ] as [number, number, number],
      geometry: geometries[Math.floor(Math.random() * geometries.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.002 + Math.random() * 0.008,
    }));
  }, []);

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff4444" />
      <pointLight position={[10, -10, -5]} intensity={0.5} color="#4444ff" />
      
      {shapes.map((shape, index) => (
        <AnimatedShape
          key={index}
          position={shape.position}
          geometry={shape.geometry}
          color={shape.color}
          speed={shape.speed}
        />
      ))}
    </>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};