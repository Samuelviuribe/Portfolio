// useMemo evita regenerar las cordenadas y la geometria en cada render
import { useFrame } from "@react-three/fiber";
import { useMemo, useEffect, useRef } from "react";
import * as THREE from 'three'; //three

const vertexShader = `
uniform float uProgress;
uniform float uTime;

void main() {
  vec3 newPosition = position;

 newPosition.x += sin(uTime + position.x * 8.0) * 0.02;
 newPosition.y += cos(uTime + position.y * 8.0) * 0.01;
 newPosition.z += sin(uTime + position.z * 8.0) * 0.03;

  gl_Position = projectionMatrix
              * modelViewMatrix
              * vec4(newPosition, 1.0);

  gl_PointSize = 3.0;
}
`;
const fragmentShader = `
void main (){

float distanceToCenter = distance(
    gl_PointCoord,
    vec2(0.5)
    );

    if (distanceToCenter > 0.5) discard;

    gl_FragColor = vec4(0.66, 0.85, 0.9, 0.9);
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

    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );

        return geometry;
    }, [positions]);
    // uprogress

    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const progressRef = useRef(0);

    useEffect(() => {
        const updateProgress = () => {
            const maxScroll = 
            document.documentElement.scrollHeight - window.innerHeight;

            progressRef.current = 
            maxScroll > 0 
            ? Math.min(1, Math.max(0, window.scrollY/maxScroll))
            :0;
        };
        
        updateProgress();
        window.addEventListener('scroll',updateProgress, {passive:true});

        return () => window.removeEventListener('Scroll', updateProgress);
    }, []);

    useFrame((state) => {
        if(materialRef.current){
            materialRef.current.uniforms.uProgress.value = 
            progressRef.current;
         
            materialRef.current.uniforms.uTime.value =
            state.clock.elapsedTime;
        }
    });

    return (
        <points geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uProgress: {value:0},
                    uTime: {value:0}
                }}
                transparent
                depthWrite={false}
                />
        </points>
    );
}