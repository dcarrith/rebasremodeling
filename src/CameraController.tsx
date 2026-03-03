import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

// Define camera waypoints for each page using position and a lookAt target
export const waypoints = [
    // 0 (0vh): Hero
    { pos: new THREE.Vector3(0, 8, 16), lookAt: new THREE.Vector3(0, 0, 0) },

    // REBA
    // 1 (100vh): Pan to Reba (Zoom Out)
    { pos: new THREE.Vector3(2, 4, 5), lookAt: new THREE.Vector3(2, 1.0, -0.89) },
    // 2 (200vh): Zoom In
    { pos: new THREE.Vector3(2, 1.0, 0.5), lookAt: new THREE.Vector3(2, 1.0, -0.89) },
    // 3 (300vh): Hold - Info Arriving
    { pos: new THREE.Vector3(2, 1.0, 0.5), lookAt: new THREE.Vector3(2, 1.0, -0.89) },
    // 4 (400vh): Hold - Info Holding
    { pos: new THREE.Vector3(2, 1.0, 0.5), lookAt: new THREE.Vector3(2, 1.0, -0.89) },
    // 5 (500vh): Zoom Out
    { pos: new THREE.Vector3(2, 4, 5), lookAt: new THREE.Vector3(2, 1.0, -0.89) },

    // KITCHENS
    // 6 (600vh): Pan to Kitchens (Zoom Out)
    { pos: new THREE.Vector3(-6, 4, 0), lookAt: new THREE.Vector3(-6, 1.2, -9.89) },
    // 7 (700vh): Zoom In
    { pos: new THREE.Vector3(-6, 0.5, -6.5), lookAt: new THREE.Vector3(-6, 0.5, -9.89) },
    // 8 (800vh): Hold - Info Arriving
    { pos: new THREE.Vector3(-6, 0.5, -6.5), lookAt: new THREE.Vector3(-6, 0.5, -9.89) },
    // 9 (900vh): Hold - Info Holding
    { pos: new THREE.Vector3(-6, 0.5, -6.5), lookAt: new THREE.Vector3(-6, 0.5, -9.89) },
    // 10 (1000vh): Zoom Out
    { pos: new THREE.Vector3(-6, 4, 0), lookAt: new THREE.Vector3(-6, 1.2, -9.89) },

    // BATHROOMS
    // 11 (1100vh): Pan to Bathrooms (Zoom Out)
    { pos: new THREE.Vector3(0, 4, 1.5), lookAt: new THREE.Vector3(9.89, 1.2, 1.5) },
    // 12 (1200vh): Zoom In
    { pos: new THREE.Vector3(6.5, 0.5, 1.5), lookAt: new THREE.Vector3(9.89, 0.5, 1.5) },
    // 13 (1300vh): Hold - Info Arriving
    { pos: new THREE.Vector3(6.5, 0.5, 1.5), lookAt: new THREE.Vector3(9.89, 0.5, 1.5) },
    // 14 (1400vh): Hold - Info Holding
    { pos: new THREE.Vector3(6.5, 0.5, 1.5), lookAt: new THREE.Vector3(9.89, 0.5, 1.5) },
    // 15 (1500vh): Zoom Out
    { pos: new THREE.Vector3(0, 4, 1.5), lookAt: new THREE.Vector3(9.89, 1.2, 1.5) },

    // LIVING SPACES
    // 16 (1600vh): Pan to Living Space (Zoom Out)
    { pos: new THREE.Vector3(-5, 4, 0), lookAt: new THREE.Vector3(-5, 1.2, 9.89) },
    // 17 (1700vh): Zoom In
    { pos: new THREE.Vector3(-5, 0.5, 6.5), lookAt: new THREE.Vector3(-5, 0.5, 9.89) },
    // 18 (1800vh): Hold - Info Arriving
    { pos: new THREE.Vector3(-5, 0.5, 6.5), lookAt: new THREE.Vector3(-5, 0.5, 9.89) },
    // 19 (1900vh): Hold - Info Holding
    { pos: new THREE.Vector3(-5, 0.5, 6.5), lookAt: new THREE.Vector3(-5, 0.5, 9.89) },

    // 20 (2000vh): Pull Back to Global View & Fade Out (Footer Arrives)
    { pos: new THREE.Vector3(0, 6, 16), lookAt: new THREE.Vector3(0, 0, 0) }
];

export default function CameraController() {
    const scroll = useScroll();
    const dummyCamera = useRef(new THREE.PerspectiveCamera());
    const targetLookAt = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        const offset = scroll.offset;
        const numWaypoints = waypoints.length;
        const progress = offset * (numWaypoints - 1);

        const index = Math.max(0, Math.min(Math.floor(progress), numWaypoints - 2));
        const nextIndex = index + 1;
        const t = Math.max(0, Math.min(progress - index, 1));
        const smoothT = THREE.MathUtils.smoothstep(t, 0, 1);

        const startObj = waypoints[index];
        const endObj = waypoints[nextIndex];

        // Interpolate position and lookAt target independently
        const currentPos = new THREE.Vector3().lerpVectors(startObj.pos, endObj.pos, smoothT);
        const currentLookAt = new THREE.Vector3().lerpVectors(startObj.lookAt, endObj.lookAt, smoothT);

        // Smoothly damp the actual camera towards the calculated path
        state.camera.position.lerp(currentPos, 4 * delta);
        targetLookAt.current.lerp(currentLookAt, 4 * delta);

        // Compute the proper quaternion to look at the dynamically interpolated target
        dummyCamera.current.position.copy(state.camera.position);
        dummyCamera.current.lookAt(targetLookAt.current);

        state.camera.quaternion.slerp(dummyCamera.current.quaternion, 8 * delta);
    });

    return null;
}
