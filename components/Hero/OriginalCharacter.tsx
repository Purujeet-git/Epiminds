"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
type Props = {
  progress: number;
};

export default function OriginalCharacter({ progress }: Props) {
  useEffect(() =>{
    scene.traverse((child) =>{
      if(!(child instanceof THREE.Mesh))
        return;
      const material = child.material;

      if(Array.isArray(material)) {

        material.forEach(mat =>{
          mat.transparent = true;
          mat.opacity = progress;
        });
      }else {
        material.transparent = true;
        material.opacity = progress;
      }

    });
  },[progress]);

  
  const { scene } = useGLTF("/models/character.glb");

  return (
    <primitive
      object={scene}
      scale={0.2}
      position={[0, 0, 0]}
      visible={progress > 0}
    />
  );
}