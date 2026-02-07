// Enemy AI hook for managing enemy fish behavior and spawning
import { useRef, useCallback } from 'react';

const MOVEMENT_PATTERNS = ['zigzag', 'sine', 'circular', 'straight'];

export const useEnemyAI = (options) => {
    const { enemyConfigs, numberRange, gameSpeed, arenaWidth, arenaHeight } = options;

    const enemiesRef = useRef([]);
    const spawnIndexRef = useRef(0);
    const nextIdRef = useRef(0);

    /**
     * Get speed multiplier based on game speed setting
     */
    const getSpeedMultiplier = useCallback(() => {
        switch (gameSpeed) {
            case 'slow': return 0.7;
            case 'fast': return 1.4;
            default: return 1.0;
        }
    }, [gameSpeed]);

    /**
     * Calculate fish scale based on number value within range
     */
    const calculateScale = useCallback((fishNumber) => {
        const [min, max] = numberRange;
        const t = max === min ? 0.5 : (fishNumber - min) / (max - min);
        return 0.7 + t * 0.9; // Scale from 0.7 to 1.6
    }, [numberRange]);

    /**
     * Get random movement pattern
     */
    const getRandomPattern = useCallback(() => {
        return MOVEMENT_PATTERNS[Math.floor(Math.random() * MOVEMENT_PATTERNS.length)];
    }, []);

    /**
     * Spawn a new enemy fish
     */
    const spawnEnemy = useCallback(() => {
        if (spawnIndexRef.current >= enemyConfigs.length) {
            return null; // All enemies spawned
        }

        const config = enemyConfigs[spawnIndexRef.current];
        spawnIndexRef.current++;

        const scale = calculateScale(config.number);
        const baseWidth = 80;
        const baseHeight = 50;
        const width = baseWidth * scale;
        const height = baseHeight * scale;

        // Spawn from right side
        const x = arenaWidth + width;
        const y = Math.random() * (arenaHeight - height - 40) + 20;

        const pattern = getRandomPattern();
        const baseSpeed = (180 + config.speed * 50) * getSpeedMultiplier();

        const enemy = {
            id: `enemy_${nextIdRef.current++}`,
            x,
            y,
            number: config.number,
            scale,
            width,
            height,
            vx: -baseSpeed,
            vy: 0,
            alive: true,
            pattern,
            patternPhase: Math.random() * Math.PI * 2,
            baseSpeed,
            spawnTime: Date.now(),
            color: config.number > numberRange[1] * 0.6 ? '#ef4444' : '#10b981',
        };

        enemiesRef.current.push(enemy);
        return enemy;
    }, [
        enemyConfigs,
        calculateScale,
        getRandomPattern,
        getSpeedMultiplier,
        arenaWidth,
        arenaHeight,
        numberRange,
    ]);

    /**
     * Update enemy positions and apply movement patterns
     */
    const updateEnemies = useCallback((deltaTime) => {
        const now = Date.now();

        enemiesRef.current.forEach((enemy) => {
            if (!enemy.alive) return;

            // Update pattern phase
            enemy.patternPhase += deltaTime * 2;

            // Apply movement pattern
            switch (enemy.pattern) {
                case 'zigzag':
                    enemy.y += Math.sin(enemy.patternPhase) * 120 * deltaTime;
                    break;

                case 'sine':
                    enemy.vy = Math.sin(enemy.patternPhase) * 100;
                    enemy.y += enemy.vy * deltaTime;
                    break;

                case 'circular':
                    const radius = 40;
                    const centerY = enemy.y;
                    enemy.y = centerY + Math.sin(enemy.patternPhase) * radius;
                    break;

                case 'straight':
                    // Just move horizontally
                    break;
            }

            // Move horizontally
            enemy.x += enemy.vx * deltaTime;

            // Clamp Y position
            enemy.y = Math.max(20, Math.min(arenaHeight - enemy.height - 20, enemy.y));
        });

        // Remove off-screen enemies
        enemiesRef.current = enemiesRef.current.filter(
            (enemy) => enemy.alive && enemy.x > -enemy.width - 50
        );
    }, [arenaHeight]);

    /**
     * Remove an enemy (when eaten)
     */
    const removeEnemy = useCallback((enemyId) => {
        const enemy = enemiesRef.current.find((e) => e.id === enemyId);
        if (enemy) {
            enemy.alive = false;
        }
    }, []);

    /**
     * Get all active enemies
     */
    const getEnemies = useCallback(() => {
        return enemiesRef.current.filter((e) => e.alive);
    }, []);

    /**
     * Reset AI state
     */
    const reset = useCallback(() => {
        enemiesRef.current = [];
        spawnIndexRef.current = 0;
        nextIdRef.current = 0;
    }, []);

    /**
     * Check if all enemies have been spawned
     */
    const allSpawned = useCallback(() => {
        return spawnIndexRef.current >= enemyConfigs.length;
    }, [enemyConfigs.length]);

    return {
        spawnEnemy,
        updateEnemies,
        removeEnemy,
        getEnemies,
        reset,
        allSpawned,
        getSpawnedCount: () => spawnIndexRef.current,
    };
};
