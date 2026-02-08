// Game engine hook for Big Fish Eat Small Fish
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePlayerControl } from './usePlayerControl';

export const useGameEngine = ({ config, arenaWidth, arenaHeight, onGameOver }) => {
    const [minNum, maxNum] = config.numberRange;
    const maxLives = config.lives || 3;
    const speedMultiplier = config.gameSpeed === 'fast' ? 1.4 : config.gameSpeed === 'slow' ? 0.7 : 1.0;

    // Game state
    const [gameState, setGameState] = useState({
        lives: maxLives,
        score: 0,
        playerNumber: config.playerFishNumber,
        isGameOver: false,
        isPaused: false,
        activePowerUps: {
            shield: 0,
            speedBoost: 0,
        },
    });

    // Player
    const playerRef = useRef({
        id: 'player',
        x: 100,
        y: arenaHeight / 2,
        number: config.playerFishNumber,
        scale: 1,
        width: 90,
        height: 55,
        vx: 0,
        vy: 0,
        alive: true,
        isInvulnerable: false,
        invulnerableUntil: 0,
    });

    // Enemies and power-ups
    const enemiesRef = useRef([]);
    const powerUpsRef = useRef([]);
    const spawnIndexRef = useRef(0);
    const nextIdRef = useRef(0);

    // Player controls
    const { updateVelocity } = usePlayerControl({
        enabled: !gameState.isGameOver && !gameState.isPaused,
        speed: 230 * speedMultiplier,
        acceleration: 0.5,
        friction: 0.85,
    });

    // Calculate scale based on number
    const calculateScale = useCallback((num) => {
        const t = maxNum === minNum ? 0.5 : (num - minNum) / (maxNum - minNum);
        return 0.7 + t * 0.9;
    }, [minNum, maxNum]);

    // Collision detection
    const checkCollision = useCallback((a, b) => {
        return !(
            a.x + a.width < b.x ||
            a.x > b.x + b.width ||
            a.y + a.height < b.y ||
            a.y > b.y + b.height
        );
    }, []);

    // Spawn enemy
    const spawnEnemy = useCallback(() => {
        if (spawnIndexRef.current >= config.enemyFish.length) return;

        const enemyConfig = config.enemyFish[spawnIndexRef.current++];
        const scale = calculateScale(enemyConfig.number);
        const width = 80 * scale;
        const height = 50 * scale;

        const patterns = ['zigzag', 'sine', 'straight'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        const enemy = {
            id: `enemy_${nextIdRef.current++}`,
            x: arenaWidth + 50,
            y: Math.random() * (arenaHeight - height - 40) + 20,
            number: enemyConfig.number,
            width,
            height,
            vx: -(180 + enemyConfig.speed * 50) * speedMultiplier,
            vy: 0,
            pattern,
            patternPhase: Math.random() * Math.PI * 2,
            baseSpeed: enemyConfig.speed,
            alive: true,
            scale,
            spawnTime: Date.now(),
        };

        enemiesRef.current.push(enemy);
    }, [config.enemyFish, calculateScale, arenaWidth, arenaHeight, speedMultiplier]);

    // Spawn power-up
    const spawnPowerUp = useCallback(() => {
        if (!config.powerUps || Math.random() > 0.15) return;

        const powerUp = {
            id: `power_${nextIdRef.current++}`,
            type: Math.random() < 0.6 ? 'shield' : 'speedBoost',
            x: arenaWidth + 50,
            y: Math.random() * (arenaHeight - 80) + 40,
            vx: -150 * speedMultiplier,
            alive: true,
            width: 40,
            height: 40,
        };

        powerUpsRef.current.push(powerUp);
    }, [config.powerUps, arenaWidth, arenaHeight, speedMultiplier]);

    // Eat enemy
    const eatEnemy = useCallback((enemy) => {
        enemy.alive = false;
        const newNumber = playerRef.current.number + enemy.number;

        playerRef.current.number = newNumber;
        const newScale = calculateScale(newNumber);
        playerRef.current.scale = newScale;
        playerRef.current.width = 90 * newScale;
        playerRef.current.height = 55 * newScale;

        setGameState(prev => ({
            ...prev,
            score: prev.score + 1,
            playerNumber: newNumber,
        }));

        spawnPowerUp();
    }, [calculateScale, spawnPowerUp]);

    // Take damage
    const takeDamage = useCallback(() => {
        if (playerRef.current.isInvulnerable) return;

        if (gameState.activePowerUps.shield > 0) {
            setGameState(prev => ({
                ...prev,
                activePowerUps: {
                    ...prev.activePowerUps,
                    shield: prev.activePowerUps.shield - 1,
                },
            }));
        } else {
            const newLives = Math.max(0, gameState.lives - 1);
            setGameState(prev => ({ ...prev, lives: newLives }));

            playerRef.current.isInvulnerable = true;
            playerRef.current.invulnerableUntil = Date.now() + 1500;
        }
    }, [gameState.activePowerUps.shield, gameState.lives]);

    // Collect power-up
    const collectPowerUp = useCallback((powerUp) => {
        powerUp.alive = false;

        if (powerUp.type === 'shield') {
            setGameState(prev => ({
                ...prev,
                activePowerUps: {
                    ...prev.activePowerUps,
                    shield: prev.activePowerUps.shield + 1,
                },
            }));
        } else if (powerUp.type === 'speedBoost') {
            setGameState(prev => ({
                ...prev,
                activePowerUps: {
                    ...prev.activePowerUps,
                    speedBoost: Date.now() + 5000,
                },
            }));
        }
    }, []);

    // Update game (call this in animation frame)
    const update = useCallback((deltaTime) => {
        if (gameState.isGameOver || gameState.isPaused) return;

        const dt = Math.min(deltaTime, 0.1);
        const player = playerRef.current;

        // Update player velocity
        const { vx, vy } = updateVelocity();
        player.vx = vx;
        player.vy = vy;

        // Move player
        player.x += player.vx * dt;
        player.y += player.vy * dt;

        // Clamp player to arena
        player.x = Math.max(0, Math.min(arenaWidth - player.width, player.x));
        player.y = Math.max(0, Math.min(arenaHeight - player.height, player.y));

        // Update invulnerability
        if (player.isInvulnerable && Date.now() > player.invulnerableUntil) {
            player.isInvulnerable = false;
        }

        // Update enemies
        enemiesRef.current.forEach(enemy => {
            if (!enemy.alive) return;

            // Move enemy
            enemy.x += enemy.vx * dt;
            enemy.patternPhase += dt * 2;

            // Apply movement pattern
            if (enemy.pattern === 'zigzag') {
                enemy.y += Math.sin(enemy.patternPhase) * 120 * dt;
            } else if (enemy.pattern === 'sine') {
                enemy.y += Math.sin(enemy.patternPhase) * 100 * dt;
            } else if (enemy.pattern === 'circular') {
                enemy.y += Math.cos(enemy.patternPhase) * 80 * dt;
            }

            // Clamp enemy to arena
            enemy.y = Math.max(20, Math.min(arenaHeight - enemy.height - 20, enemy.y));

            // Collision with player
            if (checkCollision(player, enemy)) {
                if (player.number > enemy.number) {
                    eatEnemy(enemy);
                } else {
                    takeDamage();
                    enemy.alive = false;
                }
            }
        });

        // Remove off-screen enemies
        enemiesRef.current = enemiesRef.current.filter(e => e.alive && e.x > -e.width - 50);

        // Update power-ups
        powerUpsRef.current.forEach(p => {
            if (p.alive) {
                p.x += p.vx * dt;

                // Collision with player
                if (checkCollision(player, p)) {
                    collectPowerUp(p);
                }
            }

            if (p.x < -100) p.alive = false;
        });

        powerUpsRef.current = powerUpsRef.current.filter(p => p.alive);
    }, [
        gameState.isGameOver,
        gameState.isPaused,
        updateVelocity,
        arenaWidth,
        arenaHeight,
        checkCollision,
        eatEnemy,
        takeDamage,
        collectPowerUp
    ]);

    // Auto-spawn enemies
    useEffect(() => {
        if (gameState.isGameOver || gameState.isPaused) return;

        const interval = config.gameSpeed === 'fast' ? 1200 : config.gameSpeed === 'slow' ? 2000 : 1500;
        const maxOnScreen = config.gameSpeed === 'fast' ? 6 : config.gameSpeed === 'slow' ? 3 : 4;

        const timer = setInterval(() => {
            const active = enemiesRef.current.filter(e => e.alive).length;
            if (active < maxOnScreen && spawnIndexRef.current < config.enemyFish.length) {
                spawnEnemy();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [gameState.isGameOver, gameState.isPaused, config.gameSpeed, config.enemyFish.length, spawnEnemy]);

    // Check game over
    useEffect(() => {
        const totalEnemies = config.enemyFish.length;
        const allEnemiesSpawned = spawnIndexRef.current >= totalEnemies;
        const noEnemiesLeft = enemiesRef.current.filter(e => e.alive).length === 0;

        if (gameState.lives <= 0 || (allEnemiesSpawned && noEnemiesLeft)) {
            setGameState(prev => ({ ...prev, isGameOver: true }));
            onGameOver?.();
        }
    }, [gameState.lives, config.enemyFish.length, onGameOver]);

    // Reset game
    const resetGame = useCallback(() => {
        spawnIndexRef.current = 0;
        nextIdRef.current = 0;
        enemiesRef.current = [];
        powerUpsRef.current = [];

        playerRef.current = {
            id: 'player',
            x: 100,
            y: arenaHeight / 2,
            number: config.playerFishNumber,
            scale: 1,
            width: 90,
            height: 55,
            vx: 0,
            vy: 0,
            alive: true,
            isInvulnerable: false,
            invulnerableUntil: 0,
        };

        setGameState({
            lives: maxLives,
            score: 0,
            playerNumber: config.playerFishNumber,
            isGameOver: false,
            isPaused: false,
            activePowerUps: {
                shield: 0,
                speedBoost: 0,
            },
        });
    }, [config.playerFishNumber, maxLives, arenaHeight]);

    return {
        gameState,
        player: playerRef.current,
        enemies: enemiesRef.current,
        powerUps: powerUpsRef.current,
        update,
        resetGame,
        spawnEnemy,
        totalEnemies: config.enemyFish.length,
        spawnedCount: spawnIndexRef.current,
    };
};
