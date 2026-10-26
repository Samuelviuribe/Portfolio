'use client';

import { Canvas } from '@react-three/fiber';
import ParticleSystem from './ParticleSystem';

export default function ParticleScene() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
      <ParticleSystem />
    </Canvas>
  );
}