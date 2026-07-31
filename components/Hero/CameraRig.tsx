import { useFrame,useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getHeroAnimation } from "@/lib/heroAnimation";

type Props = {
    progress: number;
};

export default function CamerRig({
    progress,
}:Props) {
    const { camera } = useThree();

    const animation = getHeroAnimation(progress);

    useFrame(() => {
        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            animation.cameraZ,
            0.08
        );
    });

    return null;
}