"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { buildParticleGeometry } from "@/hooks/useParticleGeometry";
import { getHeroAnimation } from "@/lib/heroAnimation";
import {
    calculateParticlePosition,
    calculateSettle,
} from "@/lib/particleAnimation";
import { calculateWaveInfluence } from "@/lib/particleWave";

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

    const breatheStrength = animation.breathe;
    const settleProgress = animation.settle;

    useFrame(({ clock }) => {
        if (
            !pointsRef.current ||
            !originalPositions.current ||
            !animatedPositions.current
        ) {
            return;
        }

        const time = clock.getElapsedTime();

        const positions = animatedPositions.current;
        const original = originalPositions.current;

        const random =
            geometry.attributes.aRandom.array as Float32Array;

        const normals =
            geometry.attributes.normal.array as Float32Array;

        const positionAttribute =
            geometry.attributes.position as THREE.BufferAttribute;

        const originalVector = new THREE.Vector3();
        const normalVector = new THREE.Vector3();

        // Wave settings
        const waveOrigin = new THREE.Vector3(
            0,
            0.15,
            0.02
        );

        const waveRadius = 2.2;

        for (let i = 0; i < positions.length; i += 3) {

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

            const wave = calculateWaveInfluence({
                position: originalVector,
                origin: waveOrigin,
                radius: waveRadius,
                progress: settleProgress,
            });

            const settle = calculateSettle(
                wave.influence
            );

            const amplitude =
                PARTICLE_SETTINGS.amplitude *
                breatheStrength *
                (1 - settle);

            const particlePosition =
                calculateParticlePosition({
                    original: originalVector,
                    normal: normalVector,
                    time,
                    random: r,
                    amplitude,
                    speed: PARTICLE_SETTINGS.speed,
                    settle,
                });

            positions[i] = particlePosition.x;
            positions[i + 1] = particlePosition.y;
            positions[i + 2] = particlePosition.z;
        }

        positionAttribute.needsUpdate = true;
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