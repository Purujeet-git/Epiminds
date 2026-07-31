import * as THREE from "three";

export type HeroAnimationState = {
    cameraZ: number;

    breathe: number;

    settle: number;

    hold:number;

    isHolding: number;

    isReveal:number;

    meshOpacity: number;

    particleOpacity: number;

    reveal: number;
};



export function getHeroAnimation(progress: number) {

    const breathe =  1-THREE.MathUtils.smoothstep(
        progress,
        0.25,
        0.70
    );

    const settle = THREE.MathUtils.smoothstep(
        progress,
        0.25,
        0.70
    );

    const hold = THREE.MathUtils.clamp(
        progress ,
        0.70,
        0.82
    );

    const reveal = THREE.MathUtils.smoothstep(
        progress,
        0.82,
        1.00
    );

    const isHolding = 
        progress >= 0.70 &&
        progress <= 0.82;

    const isReveal = 
        progress >= 0.82;

    let cameraZ = 2.8;

    if(progress < 0.70) {

        cameraZ = THREE.MathUtils.lerp(
            2.8,
            2.3,
            settle
        );
    }
    else if(isHolding){
        cameraZ = 2.3;
    }

    else{
        cameraZ = THREE.MathUtils.lerp(
            2.3,
            2.05,
            reveal
        );
    }

    const meshOpacity = reveal;

    const particleOpacity = 1 - reveal;
    return {
        cameraZ,

        breathe,

        settle,

        hold,

        reveal,

        meshOpacity,

        particleOpacity,

        isHolding,

        isReveal,
    };
}