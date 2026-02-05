// Player control hook for keyboard input (WASD + Arrow keys)
import { useEffect, useRef } from 'react';

export interface KeyState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface PlayerControlOptions {
    enabled: boolean;
    speed: number;
    acceleration?: number;
    friction?: number;
}

export const usePlayerControl = (options: PlayerControlOptions) => {
    const { enabled, speed, acceleration = 0.5, friction = 0.85 } = options;

    const keysRef = useRef<KeyState>({
        up: false,
        down: false,
        left: false,
        right: false,
    });

    const velocityRef = useRef({ vx: 0, vy: 0 });

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            switch (key) {
                case 'w':
                case 'arrowup':
                    keysRef.current.up = true;
                    break;
                case 's':
                case 'arrowdown':
                    keysRef.current.down = true;
                    break;
                case 'a':
                case 'arrowleft':
                    keysRef.current.left = true;
                    break;
                case 'd':
                case 'arrowright':
                    keysRef.current.right = true;
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            switch (key) {
                case 'w':
                case 'arrowup':
                    keysRef.current.up = false;
                    break;
                case 's':
                case 'arrowdown':
                    keysRef.current.down = false;
                    break;
                case 'a':
                case 'arrowleft':
                    keysRef.current.left = false;
                    break;
                case 'd':
                case 'arrowright':
                    keysRef.current.right = false;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [enabled]);

    /**
     * Update player velocity based on keyboard input
     * Call this in your game loop
     */
    const updateVelocity = (): { vx: number; vy: number } => {
        const keys = keysRef.current;
        const vel = velocityRef.current;

        // Target velocity based on input
        let targetVx = 0;
        let targetVy = 0;

        if (keys.left) targetVx -= speed;
        if (keys.right) targetVx += speed;
        if (keys.up) targetVy -= speed;
        if (keys.down) targetVy += speed;

        // Normalize diagonal movement
        if ((keys.left || keys.right) && (keys.up || keys.down)) {
            const factor = 1 / Math.sqrt(2);
            targetVx *= factor;
            targetVy *= factor;
        }

        // Apply acceleration
        vel.vx += (targetVx - vel.vx) * acceleration;
        vel.vy += (targetVy - vel.vy) * acceleration;

        // Apply friction when no input
        if (targetVx === 0) vel.vx *= friction;
        if (targetVy === 0) vel.vy *= friction;

        // Dead zone to stop completely
        if (Math.abs(vel.vx) < 0.1) vel.vx = 0;
        if (Math.abs(vel.vy) < 0.1) vel.vy = 0;

        return { vx: vel.vx, vy: vel.vy };
    };

    /**
     * Reset velocity (useful when game pauses)
     */
    const resetVelocity = () => {
        velocityRef.current = { vx: 0, vy: 0 };
    };

    /**
     * Get current key state (for debugging)
     */
    const getKeyState = (): KeyState => keysRef.current;

    return {
        updateVelocity,
        resetVelocity,
        getKeyState,
    };
};
