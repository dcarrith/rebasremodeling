import * as THREE from 'three';
import { Edges, Text, Line } from '@react-three/drei';
import RoomPortal from './RoomPortal';

function ArchitectLabel({ position, text, scale = 1 }: any) {
    return (
        <Text
            position={position}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={scale * 0.4} // Make them significantly smaller
            color="#94a3b8" // Slate 400 - much lighter, subtle
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.6}
            letterSpacing={0.3}
        >
            {text}
        </Text>
    );
}

function ArchitectDoorSwing({ position, radius, rotation = [0, 0, 0] }: any) {
    return (
        <group position={position} rotation={rotation}>
            {/* The swing arc */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <ringGeometry args={[radius - 0.02, radius, 32, 1, 0, Math.PI / 2]} />
                <meshBasicMaterial color="#94a3b8" side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>
            {/* The door leaf (represented flat on the ground for blueprint) */}
            <mesh position={[radius / 2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[radius, 0.04]} />
                <meshBasicMaterial color="#94a3b8" transparent opacity={0.8} />
            </mesh>
        </group>
    );
}

function ArchitectWindow({ position, length, rotation = [0, 0, 0] }: any) {
    return (
        <group position={position} rotation={rotation}>
            {/* Sill lines */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[length, 0.3]} />
                <meshBasicMaterial color="#e2e8f0" transparent opacity={0.5} />
            </mesh>
            {/* Glass panes (3 parallel lines) */}
            <Line points={[[-length / 2, 0.03, -0.05], [length / 2, 0.03, -0.05]]} color="#64748b" lineWidth={1} />
            <Line points={[[-length / 2, 0.03, 0], [length / 2, 0.03, 0]]} color="#64748b" lineWidth={1} />
            <Line points={[[-length / 2, 0.03, 0.05], [length / 2, 0.03, 0.05]]} color="#64748b" lineWidth={1} />
        </group>
    );
}

function ArchitectDashedLine({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
    return (
        <Line
            points={[start, end]}
            color="#94a3b8"
            lineWidth={1}
            dashed={true}
            dashSize={0.2}
            dashScale={1}
            dashOffset={0}
            gapSize={0.2}
        />
    );
}

function ArchitectBox({ position, args, rotation = [0, 0, 0] }: any) {
    return (
        <mesh position={position} rotation={rotation} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            <Edges color="#1e3a8a" />
        </mesh>
    );
}

function ArchitectPlane({ position, args, rotation = [0, 0, 0] }: any) {
    return (
        <mesh position={position} rotation={rotation} receiveShadow>
            <planeGeometry args={args} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
            <Edges color="#1e3a8a" />
        </mesh>
    );
}

function ArchitectCylinder({ position, args, rotation = [0, 0, 0] }: any) {
    return (
        <mesh position={position} rotation={rotation} castShadow receiveShadow>
            <cylinderGeometry args={args} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            <Edges color="#1e3a8a" />
        </mesh>
    );
}

// A programmatic procedural floorplan utilizing simple geometries
// Representing an open-plan minimalist house styled as an architectural 3D blueprint model.
export default function Floorplan() {
    return (
        <group position={[0, -1, 0]}>
            {/* 3D Photorealistic Wipes overlaying the physical model */}
            <RoomPortal url={`${import.meta.env.BASE_URL}reba.png`} position={[2, 2.0, -0.89]} rotation={[0, 0, 0]} startFn={0.5 / 20} size={[2.5, 1.40625]} />
            <RoomPortal url={`${import.meta.env.BASE_URL}kitchen.png`} position={[-6, 1.5, -9.89]} rotation={[0, 0, 0]} startFn={5.5 / 20} size={[5.333, 3]} />
            <RoomPortal url={`${import.meta.env.BASE_URL}bathroom.png`} position={[9.89, 1.5, 1.5]} rotation={[0, -Math.PI / 2, 0]} startFn={10.5 / 20} size={[5.333, 3]} />
            <RoomPortal url={`${import.meta.env.BASE_URL}living_room.png`} position={[-5, 1.5, 9.89]} rotation={[0, Math.PI, 0]} startFn={15.5 / 20} size={[5.333, 3]} />

            {/* Floor */}
            <ArchitectPlane position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} args={[40, 40]} />
            <gridHelper args={[40, 40, '#cbd5e1', '#e2e8f0']} position={[0, -0.09, 0]} />

            {/* House Base Floor */}
            <ArchitectPlane position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} args={[20, 20]} />
            <gridHelper args={[20, 20, '#94a3b8', '#cbd5e1']} position={[0, 0.01, 0]} />

            {/* Outer Walls */}
            <ArchitectBox position={[-10, 1.5, 0]} args={[0.2, 3, 20]} />
            <ArchitectBox position={[10, 1.5, -5]} args={[0.2, 3, 10]} />
            <ArchitectBox position={[0, 1.5, -10]} args={[20, 3, 0.2]} />

            {/* Blueprint Windows */}
            <ArchitectWindow position={[-10, 0, 2]} length={4} rotation={[0, Math.PI / 2, 0]} />
            <ArchitectWindow position={[10, 0, -2]} length={3} rotation={[0, Math.PI / 2, 0]} />
            <ArchitectWindow position={[-5, 0, -10]} length={5} rotation={[0, 0, 0]} />
            <ArchitectWindow position={[5, 0, -10]} length={4} rotation={[0, 0, 0]} />

            {/* Architectural dashed flow/alignment lines */}
            <ArchitectDashedLine start={[-8, 0.05, 8]} end={[-8, 0.05, -8]} />
            <ArchitectDashedLine start={[-8, 0.05, -8]} end={[8, 0.05, -8]} />
            <ArchitectDashedLine start={[0, 0.05, 5]} end={[0, 0.05, -5]} />
            <ArchitectDashedLine start={[-5, 0.05, 0]} end={[5, 0.05, 0]} />

            {/* Interior Walls */}
            {/* Kitchen / Living Room Divider */}
            <ArchitectBox position={[-2, 1.5, -2]} args={[0.2, 3, 8]} />

            {/* Bathroom Walls */}
            <ArchitectBox position={[5, 1.5, 5]} args={[10, 3, 0.2]} />
            <ArchitectBox position={[5, 1.5, -2]} args={[10, 3, 0.2]} />


            {/* Entryway / Meet Reba Area (0, 0, 5) */}
            <ArchitectLabel position={[0, 0.05, 1]} text="ENTRY HALL" scale={1.5} />
            <ArchitectDoorSwing position={[-2, 0.05, 4]} radius={2} rotation={[0, Math.PI, 0]} />
            <group position={[0, 0.5, 4]}>
                {/* Console Table */}
                <ArchitectBox position={[0, 0.2, -1.5]} args={[4, 0.1, 0.8]} />
                {/* Table Legs */}
                <ArchitectBox position={[-1.8, -0.3, -1.5]} args={[0.1, 0.9, 0.6]} />
                <ArchitectBox position={[1.8, -0.3, -1.5]} args={[0.1, 0.9, 0.6]} />
                {/* Decor */}
                <ArchitectCylinder position={[1, 0.4, -1.5]} args={[0.2, 0.2, 0.5, 16]} />
            </group>

            {/* Kitchen Area (-6, 0, -6) */}
            <ArchitectLabel position={[-6, 0.05, -3]} text="KITCHEN" scale={2} />
            <group position={[-6, 0.5, -6]}>
                {/* Island Base */}
                <ArchitectBox position={[0, 0, 2]} args={[4, 1, 1.2]} />
                {/* Island Counter Overhang */}
                <ArchitectBox position={[0, 0.55, 2.2]} args={[4.2, 0.1, 1.6]} />
                {/* Stools */}
                <ArchitectCylinder position={[-1, -0.1, 2.6]} args={[0.3, 0.3, 0.8, 16]} />
                <ArchitectCylinder position={[1, -0.1, 2.6]} args={[0.3, 0.3, 0.8, 16]} />

                {/* Back Counters */}
                <ArchitectBox position={[-3.5, 0, 0]} args={[1, 1, 6]} />
                {/* Tall Pantry */}
                <ArchitectBox position={[-3.5, 1, -2]} args={[1, 3, 2]} />
                {/* Range Hood */}
                <ArchitectBox position={[-3.5, 2, 1]} args={[0.8, 1, 1.5]} />
            </group>

            {/* Bathroom Area (5, 0, 1.5) */}
            <ArchitectLabel position={[5, 0.05, -0.5]} text="BATH" scale={1.5} />
            <ArchitectDoorSwing position={[2.5, 0.05, 1.5]} radius={1.2} rotation={[0, Math.PI / 2, 0]} />
            <group position={[5, 0.5, 1.5]}>
                {/* Tub */}
                <ArchitectBox position={[3, -0.3, 0]} args={[2, 0.6, 4]} />
                {/* Tub inner rim */}
                <ArchitectBox position={[3, 0.05, 0]} args={[1.6, 0.1, 3.6]} />
                {/* Floating Vanity */}
                <ArchitectBox position={[-3, 0.2, -2]} args={[3, 0.4, 1]} />
                {/* Sinks */}
                <ArchitectCylinder position={[-3.5, 0.45, -2]} args={[0.3, 0.3, 0.1, 16]} />
                <ArchitectCylinder position={[-2.5, 0.45, -2]} args={[0.3, 0.3, 0.1, 16]} />
                {/* Mirror */}
                <ArchitectPlane position={[-3, 1.5, -2.4]} rotation={[0, 0, 0]} args={[2.5, 1.5]} />
            </group>

            {/* Living Space Area (-5, 0, 6) */}
            <ArchitectLabel position={[-5, 0.05, 3]} text="LIVING" scale={2} />
            <group position={[-5, 0.2, 6]}>
                {/* L-Shape Sofa Base */}
                <ArchitectBox position={[0, 0.1, 0]} args={[6, 0.4, 1.5]} />
                <ArchitectBox position={[-2.25, 0.1, 1.5]} args={[1.5, 0.4, 2]} />
                {/* Sofa Backrest */}
                <ArchitectBox position={[0, 0.6, -0.5]} args={[6, 0.6, 0.5]} />

                {/* Coffee Table Base and Top */}
                <ArchitectBox position={[1, 0, 1.5]} args={[2, 0.1, 1.2]} />
                <ArchitectBox position={[1, 0.1, 1.5]} args={[2.2, 0.1, 1.4]} />

                {/* Rug */}
                <ArchitectPlane position={[0, -0.19, 1.5]} rotation={[-Math.PI / 2, 0, 0]} args={[8, 6]} />
            </group>

            {/* Decor / Plants */}
            <ArchitectCylinder position={[-8, 0.5, 8]} args={[0.5, 0.4, 1, 16]} />

        </group>
    );
}
