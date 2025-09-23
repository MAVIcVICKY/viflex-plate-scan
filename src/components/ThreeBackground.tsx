import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Pizza Slice Component
const PizzaSlice = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * 0.2;
      groupRef.current.rotation.y += speed * 0.4;
      groupRef.current.rotation.z += speed * 0.1;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 1.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Pizza base */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.1, 8, 1, false, 0, Math.PI * 0.8]} />
        <meshStandardMaterial color="#e67e22" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Cheese layer */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 8, 1, false, 0, Math.PI * 0.8]} />
        <meshStandardMaterial color="#f39c12" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Pepperoni */}
      <mesh position={[0.3, 0.11, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      <mesh position={[-0.2, 0.11, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
    </group>
  );
};

// Burger Component
const Burger = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * 0.15;
      groupRef.current.rotation.y += speed * 0.3;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 2) * 0.015;
      groupRef.current.position.x += Math.cos(state.clock.elapsedTime * speed * 1.2) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Bottom bun */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#d4a574" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Patty */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 16]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.05, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Top bun */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshStandardMaterial color="#d4a574" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
};

// Donut Component
const Donut = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.4;
      meshRef.current.rotation.y += speed * 0.6;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 2.5) * 0.02;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Donut base */}
      <mesh ref={meshRef}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Frosting */}
      <mesh ref={meshRef} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.82, 0.25, 8, 16]} />
        <meshStandardMaterial color="#ff69b4" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Apple Component
const Apple = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * 0.2;
      groupRef.current.rotation.y += speed * 0.5;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 1.8) * 0.025;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Apple body */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#22c55e" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Apple stem */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#4a5d23" />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.1, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.1, 0.02]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
};

// Broccoli Component
const Broccoli = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * 0.3;
      groupRef.current.rotation.y += speed * 0.4;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Broccoli head */}
      <mesh>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshStandardMaterial color="#16a34a" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Small florets */}
      <mesh position={[0.3, 0.2, 0.2]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[-0.2, 0.3, -0.1]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
        <meshStandardMaterial color="#65a30d" />
      </mesh>
    </group>
  );
};

// Chicken Leg Component
const ChickenLeg = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * 0.25;
      groupRef.current.rotation.z += speed * 0.35;
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 1.6) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main leg body */}
      <mesh>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color="#d97706" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Bone part */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.4, 8]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      {/* Bone end */}
      <mesh position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
    </group>
  );
};

// Geometric Shape Components
const FloatingCube = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.6;
      meshRef.current.rotation.y += speed * 0.4;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 2.2) * 0.025;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color="#dc2626"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const FloatingDiamond = ({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.5;
      meshRef.current.rotation.y += speed * 0.7;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 1.9) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[0.6]} />
      <meshStandardMaterial
        color="#a855f7"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const BackgroundScene = () => {
  const foodItems = useMemo(() => {
    const foodTypes = ['pizza', 'burger', 'donut', 'apple', 'broccoli', 'chicken'];
    
    return Array.from({ length: 15 }, (_, i) => ({
      type: foodTypes[i % foodTypes.length],
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10 - 4
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.6,
      speed: 0.2 + Math.random() * 0.6,
    }));
  }, []);

  const geometricShapes = useMemo(() => {
    const shapeTypes = ['cube', 'diamond'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      type: shapeTypes[i % shapeTypes.length],
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8 - 3
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.3 + Math.random() * 0.8,
    }));
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 12 - 6
      ] as [number, number, number],
      scale: 0.02 + Math.random() * 0.08,
      speed: 0.5 + Math.random() * 1.5,
      color: Math.random() > 0.5 ? "#dc2626" : "#a855f7"
    }));
  }, []);

  return (
    <>
      {/* Enhanced lighting for food items */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#dc2626" />
      <pointLight position={[-8, 6, 6]} intensity={2.2} color="#b91c1c" />
      <pointLight position={[8, -6, 6]} intensity={2.2} color="#a855f7" />
      <pointLight position={[0, 0, -6]} intensity={1.8} color="#9333ea" />
      <pointLight position={[-6, -8, 3]} intensity={2.0} color="#dc2626" />
      <pointLight position={[6, 8, 3]} intensity={2.0} color="#7c2d12" />
      
      {/* Render food items */}
      {foodItems.map((item, index) => {
        switch(item.type) {
          case 'pizza':
            return (
              <PizzaSlice
                key={`pizza-${index}`}
                position={item.position}
                scale={item.scale}
                speed={item.speed}
              />
            );
          case 'burger':
            return (
              <Burger
                key={`burger-${index}`}
                position={item.position}
                scale={item.scale}
                speed={item.speed}
              />
            );
          case 'donut':
            return (
              <Donut
                key={`donut-${index}`}
                position={item.position}
                scale={item.scale}
                speed={item.speed}
              />
            );
          case 'apple':
            return (
              <Apple
                key={`apple-${index}`}
                position={item.position}
                scale={item.scale}
                speed={item.speed}
              />
            );
          case 'broccoli':
            return (
              <Broccoli
                key={`broccoli-${index}`}
                position={item.position}
                scale={item.scale}
                speed={item.speed}
              />
            );
          case 'chicken':
            return (
              <ChickenLeg
                key={`chicken-${index}`}
                position={item.position}
                scale={item.scale}
                speed={item.speed}
              />
            );
          default:
            return null;
        }
      })}

      {/* Render geometric shapes */}
      {geometricShapes.map((shape, index) => {
        switch(shape.type) {
          case 'cube':
            return (
              <FloatingCube
                key={`cube-${index}`}
                position={shape.position}
                scale={shape.scale}
                speed={shape.speed}
              />
            );
          case 'diamond':
            return (
              <FloatingDiamond
                key={`diamond-${index}`}
                position={shape.position}
                scale={shape.scale}
                speed={shape.speed}
              />
            );
          default:
            return null;
        }
      })}
      
      {/* Enhanced particle system */}
      {particles.map((particle, i) => (
        <mesh
          key={`particle-${i}`}
          position={particle.position}
          scale={particle.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            metalness={0.8}
            roughness={0.2}
            emissive={particle.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 opacity-70">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 65 }}
        style={{ 
          background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)'
        }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  );
};