import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
    <mesh ref={meshRef} position={position} scale={0.8}>
      <primitive object={geometry} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#ff4444" />
      <pointLight position={[10, -10, -5]} intensity={0.8} color="#4444ff" />
      <pointLight position={[0, 10, -5]} intensity={0.6} color="#ff44ff" />
      
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
    <div className="fixed inset-0 -z-50 opacity-20">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'radial-gradient(circle, rgba(20,20,40,0.5) 0%, rgba(10,10,20,0.7) 100%)' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};