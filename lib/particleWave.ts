import * as THREE from 'three';

export type WaveParams = {
    position: THREE.Vector3;

    origin: THREE.Vector3;

    radius: number;

    progress: number;
}

export type WaveResult= {
    influence: number;
    edge: number;
};

export function calculateWaveInfluence({
    position,
    origin,
    radius,
    progress,
}:WaveParams) {
    const distance = position.distanceTo(origin);

    const waveFront = progress * radius;

    const falloff = 0.25;

    const influence = 
        THREE.MathUtils.smoothstep(
            waveFront - falloff,
            waveFront + falloff,
            distance
        );

    const edge = Math.exp(
        -Math.pow(distance - waveFront,2)/0.01
    );


   return {
    influence: 1 - influence,
    edge,
   };
} 
