// useMemo evita regenerar las cordenadas y la geometria en cada render
import { useFrame } from "@react-three/fiber";
import { useMemo, useEffect, useRef } from "react";
import * as THREE from 'three'; //three

const vertexShader = `
uniform float uProgress;
uniform float uTime;

attribute vec3 aTarget;
attribute vec2 aCorner;

varying float vSpark;
varying float vTrail;

void main() {
  vec3 newPosition = mix(position, aTarget, uProgress);

  float vibration = 0.025;

  float phaseX = position.y * 8.3 + position.z * 3.7;
  float phaseY = position.x * 5.2 + position.z * 9.1;
  float phaseZ = position.x * 7.4 + position.y * 4.6;

   newPosition.x += sin(uTime * 1.6 + phaseX) * vibration;
   newPosition.y += cos(uTime * 1.3 + phaseY) * vibration;
   newPosition.z += sin(uTime * 1.5 + phaseZ) * vibration;

  vec3 velocity = vec3(
    cos(uTime * 1.6 + phaseX) * vibration * 1.6,
    -sin(uTime * 1.3 + phaseY) * vibration * 1.3,
    cos(uTime * 1.5 + phaseZ) * vibration * 1.5
);

  vec4 viewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vec4 clipPosition = projectionMatrix * viewPosition;

  vec3 viewVelocity = mat3(modelViewMatrix) * velocity;
  vec2 projectedVelocity =
  (projectionMatrix * vec4(viewVelocity, 0.0)).xy;

vec2 screenDirection = length(projectedVelocity) > 0.00001
  ? normalize(projectedVelocity)
  : vec2(1.0, 0.0);

  vec2 perpendicular = vec2(-screenDirection.y, screenDirection.x);


    float trailLength = 0.018;
    float trailWidth = 0.003;

  clipPosition.xy += (
    screenDirection * aCorner.x * trailLength
    + perpendicular * aCorner.y * trailWidth
  ) * clipPosition.w;

  gl_Position = clipPosition;

  vTrail = aCorner.x;
  vSpark = fract(
    sin(dot(position, vec3(12.9898, 78.233, 45.164)))
    * 43758.5453
  );
}
`;



const fragmentShader = `
uniform float uProgress;

varying float vSpark;
varying float vTrail;

void main() {
  vec3 white = vec3(1.0);
  vec3 electricBlue = vec3(0.12, 0.25, 1.0);
  vec3 cyan = vec3(0.0, 0.9, 1.0);
  vec3 purple = vec3(0.55, 0.12, 1.0);

  vec3 color = white;

  if (vSpark > 0.65) color = electricBlue;
  if (vSpark > 0.88) color = cyan;

  float transitionGlow = sin(uProgress * 3.14159);
  color = mix(color, purple, transitionGlow * 0.9);

  // Desvanecimiento a lo largo de la estela
  float trailFade = smoothstep(-1.0, 0.8, vTrail);
   float alpha = trailFade * 0.35;
  gl_FragColor = vec4(color, alpha);
}
`;

export default function ParticleSystem() {
    const positions = useMemo(() => {
        const count = 5000;
        const points = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();

            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);

            points[i * 3] = x;
            points[i * 3 + 1] = y;
            points[i * 3 + 2] = z;
        }

        return points;
    }, []);


    const targetPositions = useMemo(() => {
        const count = positions.length / 3;
        const targets = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const group = i % 2;

            // Dirección aleatoria sobre una esfera
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);

            const offsetX = group === 0 ? 1.5 : -1.5;

            targets[i * 3] = x + offsetX;
            targets[i * 3 + 1] = y;
            targets[i * 3 + 2] = z;
            // const offsetY = group === 0 ? 1.5 : -1.5;

            // targets[i * 3] = x;
            // targets[i * 3 + 1] = y + offsetY;
            // targets[i * 3 + 2] = z;
        }

        return targets;
    }, [positions]);

    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();

        const count = positions.length / 3;
        const quadPositions = new Float32Array(count * 4 * 3);
        const quadTargets = new Float32Array(count * 4 * 3);
        const corners = new Float32Array(count * 4 * 2);

        const cornerPattern = [
            -1, -1,
            1, -1,
            1, 1,
            -1, 1,
        ];

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < 4; j++) {
                const source = i * 3;
                const dest = (i * 4 + j) * 3;

                quadPositions[dest] = positions[source];
                quadPositions[dest + 1] = positions[source + 1];
                quadPositions[dest + 2] = positions[source + 2];

                quadTargets[dest] = targetPositions[source];
                quadTargets[dest + 1] = targetPositions[source + 1];
                quadTargets[dest + 2] = targetPositions[source + 2];

                corners[(i * 4 + j) * 2] = cornerPattern[j * 2];
                corners[(i * 4 + j) * 2 + 1] = cornerPattern[j * 2 + 1];
            }
        }

        const indices = new Uint32Array(count * 6);

        for (let i = 0; i < count; i++) {
            const vertex = i * 4;
            const index = i * 6;

            indices[index] = vertex;
            indices[index + 1] = vertex + 1;
            indices[index + 2] = vertex + 2;
            indices[index + 3] = vertex;
            indices[index + 4] = vertex + 2;
            indices[index + 5] = vertex + 3;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(quadPositions, 3)
        );
        geometry.setAttribute(
            'aTarget',
            new THREE.BufferAttribute(quadTargets, 3)
        );
        geometry.setAttribute(
            'aCorner',
            new THREE.BufferAttribute(corners, 2)
        );

        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        return geometry;
    }, [positions, targetPositions]);
    // uprogress

    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const progressRef = useRef(0);
    const targetProgressRef = useRef(0);

    useEffect(() => {
        const updateProgress = () => {
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;

            progressRef.current =
                maxScroll > 0
                    ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
                    : 0;

            targetProgressRef.current = Math.min(
                1,
                Math.max(0, window.scrollY / window.innerHeight)
            );
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });

        return () => window.removeEventListener('Scroll', updateProgress);
    }, []);

    useFrame((state, delta) => {
        if (materialRef.current) {

            progressRef.current = THREE.MathUtils.damp(
                progressRef.current,
                targetProgressRef.current,
                3,
                delta
            );

            materialRef.current.uniforms.uProgress.value = 
                progressRef.current;

            materialRef.current.uniforms.uTime.value =
                state.clock.elapsedTime;
        }
    });

    return (
        <mesh geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uProgress: { value: 0 },
                    uTime: { value: 0 }
                }}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}