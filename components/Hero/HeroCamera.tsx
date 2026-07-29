"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
    progress: number;
};

export default function HeroCamera({ progress }: Props) {

    const { camera } = useThree();

    useFrame(() => {

        camera.position.z = THREE.MathUtils.lerp(
            2.8,
            0.9,
            progress
        );

        camera.lookAt(0,0,0);

    });

    return null;
}