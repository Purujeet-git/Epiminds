"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { buildParticleGeometry } from "@/hooks/useParticleGeometry";
import { getHeroAnimation } from "@/lib/heroAnimation";
import { useFrame } from "@react-three/fiber";
import { calculateParticlePosition,calculateSettle } from "@/lib/particleAnimation";
type Props = {
    progress: number;
};

const PARTICLE_SETTINGS = {
    amplitude: 0.006,
    speed: 0.55,
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
        const original = originalPositions.current;

        let minY = Infinity;
        let maxY = -Infinity;

        for (let i=1;i<original.length; i+= 3){
            minY = Math.min(minY,original[i]);
            maxY = Math.max(maxY,original[i]);
        }

        const random = 
            geometry.attributes.aRandom.array as Float32Array;

        const normals = geometry.attributes.normal.array as Float32Array;

        const positionAttributes = 
            geometry.attributes.position as THREE.BufferAttribute;

        const originalVector = new THREE.Vector3();
        const normalVector = new THREE.Vector3();

        for(let i = 0 ; i < positions.length; i += 3) {
            originalVector.set(
                original[i],
                original[i + 1],
                original[i + 2]
            );

            normalVector.set(
                normals[i],
                normals[i + 1],
                normals[i + 2]
            );

            const r = random[i / 3];

            const y = original[i + 1];

            const normalizedY = 
                (y - minY) / (maxY - minY);

            const settle = calculateSettle(
                progress,
                1 - normalizedY
            );

            const amplitude = 
                PARTICLE_SETTINGS.amplitude * 
                (1 - settle);

            const position = calculateParticlePosition({
                original: originalVector,
                normal:normalVector,
                time,
                random: r,
                amplitude,
                speed: PARTICLE_SETTINGS.speed,
                settle,
            });

            positions[i] = position.x;
            positions[i+1] = position.y;
            positions[i+2] = position.z;
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