'use client';

import { Canvas } from '@react-three/fiber';
import ParticleSystem from './ParticleSystem';

export default function ParticleScene() {
  return (
    <Canvas
  dpr={[1, 2]}
  gl={{ antialias: true }}
  camera={{ position: [0, 0, 3.5], fov: 50 }}
>
  <ParticleSystem />
</Canvas>
  );
}