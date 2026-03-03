import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Environment, ContactShadows } from '@react-three/drei';
import Floorplan from './Floorplan';
import Overlay from './Overlay';
import CameraController from './CameraController';
import { FinalFadeEffect } from './FinalFadeEffect';

function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background-light text-sage-900 font-display">
      <div className="animate-pulse flex flex-col items-center">
        <span className="material-symbols-outlined text-4xl mb-4 animate-spin">architecture</span>
        <h2 className="text-xl font-light tracking-widest">LOADING EXPERIENCE</h2>
      </div>
    </div>
  );
}

function MainApp() {
  return (
    <div className="h-screen w-screen bg-background-light">
      <Canvas shadows camera={{ position: [0, 15, 20], fov: 45 }}>
        <color attach="background" args={['#f6f8f6']} />

        {/* Soft, serene lighting fitting the "Airy & Minimalist" theme */}
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={1.5}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          shadow-camera-right={15}
          shadow-camera-left={-15}
          shadow-bias={-0.0001}
        />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <ScrollControls pages={21} damping={0.25} distance={1.2}>
            <CameraController />
            <Floorplan />
            <ContactShadows resolution={1024} scale={40} blur={2} opacity={0.4} far={10} color="#111b0e" />
            <FinalFadeEffect />
            <Scroll html>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <MainApp />
    </Suspense>
  );
}
