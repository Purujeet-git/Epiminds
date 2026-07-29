import * as THREE from "three";

export function getHeroAnimation(progress:number) {
    return {
        cameraZ:
            THREE.MathUtils.lerp(
                2.8,
                1.5,
                progress
            ),

        particleOpacity:
            1 - THREE.MathUtils.smoothstep(
                progress,
                0.25,
                1.85
            ),

        meshOpacity:
            THREE.MathUtils.smoothstep(
                progress,
                0.35,
                1
            )
    };
}