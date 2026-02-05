// Canvas component for rendering fish and game entities
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { PlayerFish, EnemyFish, PowerUp } from '../types/game.types';

interface FishCanvasProps {
    width: number;
    height: number;
    player: PlayerFish;
    enemies: EnemyFish[];
    powerUps: PowerUp[];
    maxNumber: number;
}

export interface FishCanvasHandle {
    getContext: () => CanvasRenderingContext2D | null;
}

export const FishCanvas = forwardRef<FishCanvasHandle, FishCanvasProps>(
    ({ width, height, player, enemies, powerUps, maxNumber }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);

        useImperativeHandle(ref, () => ({
            getContext: () => canvasRef.current?.getContext('2d') || null,
        }));

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw enemies
            enemies.forEach(enemy => {
                if (enemy.alive) {
                    const isRed = enemy.number > maxNumber * 0.6;
                    drawFish(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.number, isRed);
                }
            });

            // Draw power-ups
            powerUps.forEach(p => {
                if (p.alive) {
                    drawPowerUp(ctx, p.x, p.y, p.type);
                }
            });

            // Note: Player is rendered separately as DOM element for GSAP animations
        }, [width, height, enemies, powerUps, maxNumber, player]);

        return (
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="absolute inset-0"
            />
        );
    }
);

FishCanvas.displayName = 'FishCanvas';

// Helper: Draw fish
const drawFish = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    number: number,
    isRed: boolean
) => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(-1, 1);

    // Body
    ctx.fillStyle = isRed ? '#ef4444' : '#10b981';
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.4, height * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-width * 0.3, 0);
    ctx.lineTo(-width * 0.5, -height * 0.25);
    ctx.lineTo(-width * 0.5, height * 0.25);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(width * 0.15, -height * 0.15, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(width * 0.17, -height * 0.15, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Number label - reset ALL transforms first
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity matrix

    const labelX = x + width / 2;
    const labelY = y + height + 25;

    // Set font
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = String(number);
    const metrics = ctx.measureText(text);
    const badgeWidth = metrics.width + 16;
    const badgeHeight = 32;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
        labelX - badgeWidth / 2,
        labelY - badgeHeight / 2,
        badgeWidth,
        badgeHeight
    );

    // Black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        labelX - badgeWidth / 2,
        labelY - badgeHeight / 2,
        badgeWidth,
        badgeHeight
    );

    // Black outline on text
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeText(text, labelX, labelY);

    // Bright colored text
    ctx.fillStyle = isRed ? '#ff0000' : '#00ff00';
    ctx.fillText(text, labelX, labelY);

    ctx.restore();
};

// Helper: Draw power-up
const drawPowerUp = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    type: 'shield' | 'speedBoost'
) => {
    ctx.save();

    // Background circle
    ctx.fillStyle = type === 'shield' ? '#a78bfa' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(x + 20, y + 20, 18, 0, Math.PI * 2);
    ctx.fill();

    // Icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type === 'shield' ? '🛡' : '⚡', x + 20, y + 20);

    ctx.restore();
};
