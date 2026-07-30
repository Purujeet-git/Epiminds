import * as THREE from "three";

export type ParticleAnimationParams = {
    time: number,
    progress: number,
    random: number,
    amplitude: number,
    speed: number,
};

export type ParticlePositionParams = {
    original: THREE.Vector3;
    normal: THREE.Vector3;
    time:number;
    random:number;
    amplitude: number;
    speed:number;
    settle:number;
}

export function calculateBreathing({
    time, 
    random,
    amplitude,
    speed,
}: ParticleAnimationParams): number {
    return (
        Math.sin(
            time * speed +
            random * 20
        ) * amplitude
    );
}

export function calculateSettle(
    progress: number,
    normalizedProgress: number
): number {
    const particleProgress = THREE.MathUtils.clamp(
        (progress - normalizedProgress * 0.4) / 0.6,
        0,
        1
    );

    return THREE.MathUtils.smoothstep(
        particleProgress,
        0,
        1
    );
}

export function calculateParticlePosition({
    original,
    normal,
    time,
    random,
    amplitude,
    speed,
    settle

}:ParticlePositionParams):THREE.Vector3 {
    const breathe = 
        Math.sin(
            time * speed +
            random * 20
        ) * 
        amplitude *
        (1 - settle);

    return original.clone().add(
        normal.clone().multiplyScalar(breathe)
    );
}