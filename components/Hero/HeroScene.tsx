"use client";

import { Canvas } from "@react-three/fiber";
import Character from "./OriginalCharacter";
import ParticleCharacter from "./ParticleCharacter";
import { useState } from "react";
import HeroCamera from "./HeroCamera";

export default function HeroScene() {


  const [progress, setProgress] = useState(0);

  return (
    <>
    <Canvas
    >

      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <HeroCamera progress={progress}/>
      <Character progress={progress}/>
      <ParticleCharacter progress={progress}/>
    </Canvas>

    <button onClick={() => setProgress(1)}>
      Test
    </button>
    </>
  );
}