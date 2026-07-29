import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

export function createParticleGeometry(
    mesh: THREE.Mesh,
    count = 150000
) {
    const sampler = new MeshSurfaceSampler(mesh).build();

    const positions = new Float32Array(count * 3);

    const tempPosition = new THREE.Vector3();

    for (let i = 0; i < count; i++) {

        sampler.sample(tempPosition);

        positions[i * 3 + 0] = tempPosition.x;
        positions[i * 3 + 1] = tempPosition.y;
        positions[i * 3 + 2] = tempPosition.z;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    return geometry;
}