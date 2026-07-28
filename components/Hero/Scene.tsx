"use client";

import { Canvas } from "@react-three/fiber";
import Character from "./Character";

export default function Scene() {
  return (
    <Canvas
      camera={{
        position: [0,0.2, 3.7],
        fov: 28,
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Character />
    </Canvas>
  );
}