"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { buildParticleGeometry } from "@/hooks/useParticleGeometry";
import { getHeroAnimation } from "@/lib/heroAnimation";
import { useFrame } from "@react-three/fiber";
type Props = {
    progress: number;
};

export default function ParticleCharacter({ progress }: Props) {
    const { scene } = useGLTF("/models/character.glb");
    const pointsRef = useRef<THREE.Points>(null);
    const originalPositions = useRef<Float32Array | null>(null);
    const animatedPositions = useRef<Float32Array | null>(null);
    const geometry = useMemo(() => {


        return buildParticleGeometry(scene);
    }, [scene]);

    useEffect(() => {
        const original = new Float32Array(
            geometry.attributes.position.array as Float32Array
        );

        originalPositions.current = original;

        animatedPositions.current = new Float32Array(original);

    }, [geometry]);


    const animation = getHeroAnimation(progress);

    useFrame(({clock}) => {

        if(
            !pointsRef.current ||
            !originalPositions.current ||
            !animatedPositions.current
        ) {
            return;
        }

        const time = clock.getElapsedTime();

        const positions = animatedPositions.current;
        const original = animatedPositions.current;

        const random = 
            geometry.attributes.aRandom.array as Float32Array;

        const positionAttributes = 
            geometry.attributes.position as THREE.BufferAttribute;

        const amplitude = 0.05;

        for(let i = 0 ; i < positions.length; i += 3) {
            const particleIndex = i / 3;

            const r = random[particleIndex];

            positions[i] = 
                original[i] +
                Math.sin(time * 1 + r * 20) * amplitude;

            positions[i + 1] = 
                original[i + 1] + 
                Math.cos(time * 1 + r * 20) * amplitude;

            positions[i+2] = 
                original[i+2];
        }

        positionAttributes.array = positions;

        positionAttributes.needsUpdate = true;
    });


    return (
        <points
            ref={pointsRef}
            geometry={geometry}
            scale={0.2}
            position={[0, 0, 0]}
            visible={progress < 1}
        >
            <pointsMaterial
                transparent
                opacity={animation.particleOpacity}
                color="#ffffff"
                size={0.006}
            />
        </points>
    );
}