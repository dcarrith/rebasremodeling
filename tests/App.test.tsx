import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App';
import React from 'react';

// Mock components that might cause issues in a JSDOM environment 
// (like Canvas from @react-three/fiber which requires WebGL context)
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: any) => <div data-testid="mock-canvas">{children}</div>,
    useFrame: vi.fn(),
    extend: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
    ScrollControls: ({ children }: any) => <div data-testid="mock-scroll-controls">{children}</div>,
    Scroll: ({ children }: any) => <div data-testid="mock-scroll">{children}</div>,
    Environment: () => <div data-testid="mock-environment" />,
    ContactShadows: () => <div data-testid="mock-contact-shadows" />,
    useScroll: () => ({ offset: 0, range: vi.fn(), curve: vi.fn() }),
    useTexture: vi.fn(),
    shaderMaterial: vi.fn(),
    Text: ({ children }: any) => <div>{children}</div>,
    Line: () => <div />,
    Edges: () => <div />
}));

vi.mock('@react-three/postprocessing', () => ({
    EffectComposer: ({ children }: any) => <div data-testid="mock-effect-composer">{children}</div>,
    Noise: () => <div />,
    Vignette: () => <div />,
    HueSaturation: () => <div />,
    BrightnessContrast: () => <div />
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        // Render the Suspense-wrapped component
        render(<App />);

        // Check if either loading state or mock canvas is present
        const loadingText = screen.queryByText(/LOADING EXPERIENCE/i);
        const mockCanvas = screen.queryByTestId('mock-canvas');

        expect(loadingText || mockCanvas).toBeTruthy();
    });
});
