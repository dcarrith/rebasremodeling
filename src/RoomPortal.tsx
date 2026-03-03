import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const ImageWipeMaterial = shaderMaterial(
  {
    uTex: new THREE.Texture(),
    uProgress: 0,
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform sampler2D uTex;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    // Map edge from -0.2 to 1.2 to fully clear the bounds with a 0.2 soft edge
    float edge = uProgress * 1.4 - 0.2;
    float alpha = smoothstep(vUv.x - 0.1, vUv.x + 0.1, edge);
    vec4 texColor = texture2D(uTex, vUv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
  }
  `
);
extend({ ImageWipeMaterial });

export default function RoomPortal({ url, position, rotation, startFn, size = [12, 6.75] }: any) {
  const tex = useTexture(url);
  // @ts-ignore
  const scroll = useScroll();
  const matRef = useRef<any>(null);
  const meshRef = useRef<any>(null);

  useFrame(() => {
    const r = scroll.range(startFn, 1 / 20); // Wipe completes in exactly 1 page height (100vh)
    if (matRef.current) {
      matRef.current.uProgress = r;
    }
    if (meshRef.current) {
      meshRef.current.visible = r > 0;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} renderOrder={1} visible={false}>
      <planeGeometry args={size} />
      {/* @ts-ignore */}
      <imageWipeMaterial ref={matRef} uTex={tex} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}
