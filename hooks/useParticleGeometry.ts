import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

type ParticleConfig = {
  match: string;
  count: number;
};

const DEFAULT_PARTICLES = 20000;



function keepParticle(pos: THREE.Vector3) {
  // Default: keep everything
  let probability = 1.0;

  // Hair region
  if (pos.y > 0.85) {
    const heightFactor = Math.min((pos.y - 0.95) / 0.35, 1);

    // Wider points are more likely to be hair
    const widthFactor = Math.min(Math.abs(pos.x) / 0.22, 1);

    probability = 1.0 - 0.75 * heightFactor * widthFactor;
  }

  return Math.random() < probability;
}

export function buildParticleGeometry(scene: THREE.Group) {
  const positions: number[] = [];
  const normals: number[] = [];
  const random: number[] = [];
  const sizes: number[] = [];

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const name = child.name.toLowerCase();

    let particleCount = DEFAULT_PARTICLES;

    // Decide how many particles this mesh gets
    

    console.log(name, particleCount);

    // Build the sampler
    const sampler = new MeshSurfaceSampler(child).build();
    const position = new THREE.Vector3();
    const normal = new THREE.Vector3();

    // Sample points
    let accepted = 0;

    while (accepted < particleCount) {
      sampler.sample(position, normal);

      if (!keepParticle(position)) continue;

      positions.push(
        position.x,
        position.y,
        position.z
      );

      normals.push(
        normal.x,
        normal.y,
        normal.z
      );

      random.push(Math.random());
      sizes.push(0.5 + Math.random() * 0.5);
      accepted++;
    }
  });

  // Create one geometry containing all particles
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      positions,
      3
    )
  );

  geometry.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(normals, 3)
  );

  geometry.setAttribute(
    "aRandom",
    new THREE.Float32BufferAttribute(random, 1)
  );

  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizes, 1)
  );

  geometry.computeBoundingSphere();

  return geometry;
}