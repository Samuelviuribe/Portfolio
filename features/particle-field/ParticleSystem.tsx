import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
uniform float uProgress;
uniform float uGroupProgress;
uniform float uTime;
uniform vec2 uResolution;

attribute vec3 aTarget;
attribute vec3 aGroupTarget;
attribute vec2 aCorner;
attribute float aGroupId;

varying float vSpark;
varying float vTrail;
varying float vGroupId;

void main() {
  // Estado 1: esfera original -> dos esferas
  vec3 newPosition = mix(position, aTarget, uProgress);

  // Estado 2: dos esferas -> diez grupos
  newPosition = mix(newPosition, aGroupTarget, uGroupProgress);

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

  vec2 pixelVelocity = projectedVelocity * uResolution;

  vec2 screenDirection = length(pixelVelocity) > 0.00001
    ? normalize(pixelVelocity)
    : vec2(1.0, 0.0);

  vec2 perpendicular = vec2(-screenDirection.y, screenDirection.x);

  float trailLength = 8.0;
  float trailWidth = 1.5;

  vec2 pixelOffset =
    screenDirection * aCorner.x * trailLength
    + perpendicular * aCorner.y * trailWidth;

  clipPosition.xy +=
    (pixelOffset * 2.0 / uResolution) * clipPosition.w;

  gl_Position = clipPosition;

  vTrail = aCorner.x;

  vSpark = fract(
    sin(dot(position, vec3(12.9898, 78.233, 45.164)))
    * 43758.5453
  );

  vGroupId = aGroupId;
}
`;

const fragmentShader = `
uniform float uProgress;
uniform float uTime;
uniform float uGroupProgress;

varying float vGroupId;
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

  float trailFade = smoothstep(-1.0, 0.8, vTrail);

  // Cada grupo tiene un ciclo independiente
  float seed = fract(
    sin(vGroupId * 127.1 + 311.7) * 43758.5453
  );

  float duration = mix(5.0, 11.0, seed);
  float cycle = mod(uTime + seed * duration, duration) / duration;

  float fadeIn = smoothstep(0.0, 0.2, cycle);
  float fadeOut = 1.0 - smoothstep(0.55, 0.85, cycle);

  float visibility = fadeIn * fadeOut;

  float alpha = trailFade * 0.18 * mix(1.0, visibility, uGroupProgress);

    gl_FragColor = vec4(color, alpha);
}
`;

export default function ParticleSystem() {
    const { size } = useThree();

    const positions = useMemo(() => {
        const count = 5000;
        const points = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();

            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            points[i * 3] = Math.sin(phi) * Math.cos(theta);
            points[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
            points[i * 3 + 2] = Math.cos(phi);
        }

        return points;
    }, []);

    // Destino intermedio: dos esferas
    const targetPositions = useMemo(() => {
        const count = positions.length / 3;
        const targets = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const group = i % 2;

            const u = Math.random();
            const v = Math.random();

            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);

            const offsetX = group === 0 ? -1.5 : 1.5;

            targets[i * 3] = x + offsetX;
            targets[i * 3 + 1] = y;
            targets[i * 3 + 2] = z;
        }

        return targets;
    }, [positions]);

    // Destino final: diez grupos de 500 partículas
    const groupPositions = useMemo(() => {
        const count = positions.length / 3;
        const targets = new Float32Array(count * 3);

        const isMobile = size.width / size.height < 1;

        const columns = isMobile ? 2 : 5;
        const rows = isMobile ? 5 : 2;

        const spacingX = isMobile ? 0.85 : 1.05;
        const spacingY = isMobile ? 0.58 : 1.25;

        const startX = -((columns - 1) * spacingX) / 2;
        const startY = ((rows - 1) * spacingY) / 2;

        for (let i = 0; i < count; i++) {
            const groupId = Math.floor(i / 500);

            const column = groupId % columns;
            const row = Math.floor(groupId / columns);

            const centerX = startX + column * spacingX;
            const centerY = startY - row * spacingY;

            // Distribución esférica dentro de cada grupo
            const u = Math.random();
            const v = Math.random();

            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const radius = 0.28 * Math.cbrt(Math.random());

            targets[i * 3] =
                centerX + radius * Math.sin(phi) * Math.cos(theta);

            targets[i * 3 + 1] =
                centerY + radius * Math.sin(phi) * Math.sin(theta);

            targets[i * 3 + 2] =
                radius * Math.cos(phi);
        }

        return targets;
    }, [positions, size.width, size.height]);

    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();

        const count = positions.length / 3;

        const quadPositions = new Float32Array(count * 4 * 3);
        const quadTargets = new Float32Array(count * 4 * 3);
        const quadGroupTargets = new Float32Array(count * 4 * 3);
        const corners = new Float32Array(count * 4 * 2);
        const groupIds = new Float32Array(count * 4);

        const cornerPattern = [
            -1, -1,
            1, -1,
            1, 1,
            -1, 1,
        ];

        for (let i = 0; i < count; i++) {
            const groupId = Math.floor(i / 500);
            for (let j = 0; j < 4; j++) {
                const source = i * 3;
                const dest = (i * 4 + j) * 3;

                groupIds[i * 4 + j] = groupId;
                quadPositions[dest] = positions[source];
                quadPositions[dest + 1] = positions[source + 1];
                quadPositions[dest + 2] = positions[source + 2];

                quadTargets[dest] = targetPositions[source];
                quadTargets[dest + 1] = targetPositions[source + 1];
                quadTargets[dest + 2] = targetPositions[source + 2];

                quadGroupTargets[dest] = groupPositions[source];
                quadGroupTargets[dest + 1] = groupPositions[source + 1];
                quadGroupTargets[dest + 2] = groupPositions[source + 2];

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
            "position",
            new THREE.BufferAttribute(quadPositions, 3)
        );

        geometry.setAttribute(
            "aTarget",
            new THREE.BufferAttribute(quadTargets, 3)
        );

        geometry.setAttribute(
            "aGroupTarget",
            new THREE.BufferAttribute(quadGroupTargets, 3)
        );

        geometry.setAttribute(
            "aCorner",
            new THREE.BufferAttribute(corners, 2)
        );

        geometry.setAttribute(
            "aGroupId",
            new THREE.BufferAttribute(groupIds, 1)
        );

        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        return geometry;
    }, [positions, targetPositions, groupPositions]);

    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const progressRef = useRef(0);
    const targetProgressRef = useRef(0);

    const groupProgressRef = useRef(0);
    const targetGroupProgressRef = useRef(0);

    useEffect(() => {
        const updateProgress = () => {
            // Primera transición: esfera -> dos esferas
            targetProgressRef.current = Math.min(
                1,
                Math.max(0, window.scrollY / window.innerHeight)
            );

            // Segunda transición: dos esferas -> diez grupos
            const aboutSection = document.getElementById("about");

            if (aboutSection) {
                const aboutTop =
                    aboutSection.getBoundingClientRect().top + window.scrollY;

                const transitionStart = aboutTop - window.innerHeight * 0.95;
                const transitionEnd = aboutTop + window.innerHeight * 0.5;

                targetGroupProgressRef.current = THREE.MathUtils.clamp(
                    (window.scrollY - transitionStart) /
                    (transitionEnd - transitionStart),
                    0,
                    1
                );
            }
        };

        updateProgress();

        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    useFrame((state, delta) => {
        if (!materialRef.current) return;

        const uniforms = materialRef.current.uniforms;

        uniforms.uResolution.value.set(
            state.size.width,
            state.size.height
        );

        progressRef.current = THREE.MathUtils.damp(
            progressRef.current,
            targetProgressRef.current,
            3,
            delta
        );

        groupProgressRef.current = THREE.MathUtils.damp(
            groupProgressRef.current,
            targetGroupProgressRef.current,
            3,
            delta
        );

        uniforms.uProgress.value = progressRef.current;
        uniforms.uGroupProgress.value = groupProgressRef.current;
        uniforms.uTime.value = state.clock.elapsedTime;
    });

    return (
        <mesh geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uProgress: { value: 0 },
                    uGroupProgress: { value: 0 },
                    uTime: { value: 0 },
                    uResolution: {
                        value: new THREE.Vector2(size.width, size.height),
                    },
                }}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}