import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGameEngine } from '../../hooks/useGameEngine';
import { FishCanvas } from '../../components/FishCanvas';
import { GameHUD, GameOverOverlay } from '../../components/GameHUD';
import type { GameConfig, GameResult, Game } from '../../types/game.types';

interface BigFishGameProps {
    game: Game;
    config: GameConfig;
    onExit: () => void;
    onFinish?: (result: GameResult) => void;
    submitting?: boolean;
    submitMsg?: string;
}

const BigFishEatSmallGame: React.FC<BigFishGameProps> = ({
    game,
    config,
    onExit,
    onFinish,
    submitting,
    submitMsg,
}) => {
    const arenaRef = useRef<HTMLDivElement>(null);
    const playerElRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const startTimeRef = useRef(Date.now());

    const [arenaSize, setArenaSize] = useState({ width: 800, height: 500 });
    const [maxNum] = config.numberRange;

    // Game engine
    const {
        gameState,
        player,
        enemies,
        powerUps,
        update,
        resetGame,
        totalEnemies,
        spawnedCount,
    } = useGameEngine({
        config,
        arenaWidth: arenaSize.width,
        arenaHeight: arenaSize.height,
        onGameOver: () => {
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
            onFinish?.({
                correctAnswers: gameState.score,
                totalQuestions: totalEnemies,
                playDurations: duration,
            });
        },
    });

    // Game loop
    const gameLoop = (time: number) => {
        const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
        lastTimeRef.current = time;

        // Update game logic
        update(dt);

        // Update player DOM element position
        if (playerElRef.current) {
            gsap.set(playerElRef.current, {
                x: player.x,
                y: player.y,
                scale: player.scale,
            });

            // Blinking effect when invulnerable
            if (player.isInvulnerable) {
                const opacity = Math.sin(Date.now() / 100) * 0.3 + 0.7;
                gsap.set(playerElRef.current, { opacity });
            } else {
                gsap.set(playerElRef.current, { opacity: 1 });
            }
        }

        animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    useEffect(() => {
        animFrameRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [update, player]);

    // Resize arena
    useEffect(() => {
        const updateSize = () => {
            if (arenaRef.current) {
                const rect = arenaRef.current.getBoundingClientRect();
                setArenaSize({ width: rect.width, height: rect.height });
            }
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        if (arenaRef.current) observer.observe(arenaRef.current);
        return () => observer.disconnect();
    }, []);

    const handleRestart = () => {
        resetGame();
        startTimeRef.current = Date.now();
    };

    const isVictory = gameState.isGameOver && gameState.lives > 0;

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {game?.name || 'Big Fish Eat Small'}
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900">Cá Lớn Nuốt Cá Bé</div>
                    <div className="mt-1 text-xs text-slate-600">
                        Use WASD or Arrow keys to move. Eat smaller fish!
                    </div>
                </div>
                <button
                    onClick={onExit}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <i className="fa-solid fa-arrow-left mr-2" />
                    Back
                </button>
            </div>

            {/* Arena */}
            <div
                ref={arenaRef}
                className="relative h-[500px] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-cyan-50 via-blue-50 to-blue-100"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute left-10 top-20 w-24 h-24 rounded-full bg-white/40 blur-2xl" />
                    <div className="absolute right-20 top-40 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
                </div>

                {/* Canvas for enemies and power-ups */}
                <FishCanvas
                    width={arenaSize.width}
                    height={arenaSize.height}
                    player={player}
                    enemies={enemies}
                    powerUps={powerUps}
                    maxNumber={maxNum}
                />

                {/* Player fish (DOM element for GSAP animations) */}
                <div ref={playerElRef} className="absolute pointer-events-none" style={{ transformOrigin: 'center center' }}>
                    <svg width="90" height="55" viewBox="0 0 90 55" className="drop-shadow-lg">
                        <defs>
                            <linearGradient id="grad-player" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#1e40af" />
                            </linearGradient>
                        </defs>
                        <path d="M15 27.5 L5 15 L5 40 Z" fill="url(#grad-player)" opacity="0.9" />
                        <ellipse cx="45" cy="27.5" rx="30" ry="22" fill="url(#grad-player)" />
                        <circle cx="60" cy="20" r="6" fill="white" />
                        <circle cx="62" cy="20" r="3" fill="black" />
                        <path d="M70 27 Q75 30 70 33" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1.5 text-base font-black text-blue-700 border-2 border-blue-200 shadow-lg">
                        {player.number}
                    </div>
                </div>

                {/* HUD */}
                <GameHUD
                    gameState={gameState}
                    playerNumber={player.number}
                    maxLives={config.lives}
                />

                {/* Game Over Overlay */}
                {gameState.isGameOver && (
                    <GameOverOverlay
                        score={gameState.score}
                        totalEnemies={totalEnemies}
                        isVictory={isVictory}
                        onRestart={handleRestart}
                        onExit={onExit}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-sm text-slate-600">
                {submitting
                    ? 'Saving...'
                    : submitMsg ||
                    `Spawned: ${spawnedCount}/${totalEnemies} • Active: ${enemies.filter(e => e.alive).length}`}
            </div>
        </div>
    );
};

export default BigFishEatSmallGame;
