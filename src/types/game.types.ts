// Type definitions for Big Fish Eat Small Fish game

export type GameSpeed = 'slow' | 'normal' | 'fast';
export type PowerUpType = 'shield' | 'speedBoost';
export type MovementPattern = 'zigzag' | 'sine' | 'circular' | 'straight';

export interface EnemyConfig {
    number: number;
    speed: number;
}

export interface GameConfig {
    playerFishNumber: number;
    enemyFish: EnemyConfig[];
    numberRange: [number, number];
    lives: number;
    gameSpeed: GameSpeed;
    powerUps: boolean;
}

export interface Position {
    x: number;
    y: number;
}

export interface Velocity {
    vx: number;
    vy: number;
}

export interface Fish extends Position, Velocity {
    id: string;
    number: number;
    scale: number;
    width: number;
    height: number;
    alive: boolean;
    color?: string;
}

export interface PlayerFish extends Fish {
    isInvulnerable: boolean;
    invulnerableUntil: number;
}

export interface EnemyFish extends Fish {
    pattern: MovementPattern;
    patternPhase: number;
    baseSpeed: number;
    spawnTime: number;
}

export interface PowerUp extends Position {
    id: string;
    type: PowerUpType;
    vx: number;
    alive: boolean;
    width: number;
    height: number;
}

export interface GameState {
    lives: number;
    score: number;
    playerNumber: number;
    isGameOver: boolean;
    isPaused: boolean;
    activePowerUps: {
        shield: number;
        speedBoost: number;
    };
}

export interface GameResult {
    correctAnswers: number;
    totalQuestions: number;
    playDurations: number;
}

export interface Game {
    gameId: string;
    name: string;
}

