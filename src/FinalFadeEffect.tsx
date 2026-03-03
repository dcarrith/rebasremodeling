import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, HueSaturation, BrightnessContrast } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

export function FinalFadeEffect() {
    const scroll = useScroll();

    // We'll use these refs to directly manipulate the post-processing materials each frame
    const hueSaturationRef = useRef<any>(null);
    const brightnessContrastRef = useRef<any>(null);

    useFrame((state) => {
        // The last two pages are footer transitions. (offset 0 -> 1 over 11 intervals)
        // Living spaces finishes its hold at 900vh (9/11) and finishes leaving at 1000vh (10/11)
        // Then the text scrolls up from 1000vh to 1100vh.

        // Use scroll.range to map the 900vh -> 1000vh portion perfectly to 0 -> 1 progress
        const fadeProgress = scroll.range(19 / 20, 1 / 20);

        // Apply effects
        if (hueSaturationRef.current) {
            // Desaturate to black and white (-1 is fully desaturated)
            hueSaturationRef.current.saturation = THREE.MathUtils.lerp(0, -1, fadeProgress);
        }

        if (brightnessContrastRef.current) {
            // Darken the scene slightly to make the white CTA text pop
            // 0 is normal, -1 is pitch black. We'll go to -0.6
            brightnessContrastRef.current.brightness = THREE.MathUtils.lerp(0, -0.6, fadeProgress);
        }

        // We also want to fade the actual canvas background color from #f6f8f6 to a dark gray #111b0e
        const lightBg = new THREE.Color('#f6f8f6');
        const darkBg = new THREE.Color('#111b0e');
        state.scene.background = lightBg.lerp(darkBg, fadeProgress);
    });

    return (
        <EffectComposer autoClear={false}>
            <HueSaturation ref={hueSaturationRef} />
            <BrightnessContrast ref={brightnessContrastRef} />
        </EffectComposer>
    );
}
