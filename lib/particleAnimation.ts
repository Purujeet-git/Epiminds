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
    influence: number
): number {

    return THREE.MathUtils.smoothstep(
        influence,
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