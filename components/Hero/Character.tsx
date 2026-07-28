"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Character() {
  const { scene } = useGLTF("/models/character.glb");

  useEffect(() => {
    console.clear();

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log("========== MESH ==========");
        console.log("Name:", child.name);

        console.log("Geometry:", child.geometry);

        console.log(
          "Vertices:",
          child.geometry.attributes.position.count
        );

        console.log(
          "Material:",
          child.material
        );
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}