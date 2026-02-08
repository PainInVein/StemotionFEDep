// GSAP animation utilities for Big Fish game
import gsap from 'gsap';

/**
 * Animate fish growth when eating a smaller fish
 */
export const animateGrowth = (element: HTMLElement | null, targetScale: number): void => {
    if (!element) return;

    gsap.to(element, {
        scale: targetScale,
        duration: 0.3,
        ease: 'back.out(1.4)',
    });

    // Subtle bounce effect
    gsap.fromTo(
        element,
        { y: '+=0' },
        { y: '-=8', duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
};

/**
 * Animate damage taken (shake + flash red)
 */
export const animateDamage = (
    element: HTMLElement | null,
    containerRef?: React.RefObject<HTMLDivElement>
): void => {
    if (!element) return;

    // Flash red
    gsap.fromTo(
        element,
        { filter: 'drop-shadow(0 0 0 rgba(239,68,68,0))' },
        {
            filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.8))',
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: 'none',
        }
    );

    // Blink opacity
    gsap.fromTo(
        element,
        { opacity: 1 },
        { opacity: 0.3, duration: 0.08, yoyo: true, repeat: 5, ease: 'none' }
    );

    // Shake container
    if (containerRef?.current) {
        gsap.fromTo(
            containerRef.current,
            { x: 0 },
            {
                x: 12,
                yoyo: true,
                repeat: 7,
                duration: 0.045,
                ease: 'power1.inOut',
                onComplete: () => { gsap.set(containerRef.current, { x: 0 }); },
            }
        );
    }
};

/**
 * Subtle swimming idle animation
 */
export const animateSwim = (element: HTMLElement | null): gsap.core.Tween | null => {
    if (!element) return null;

    return gsap.to(element, {
        y: '+=6',
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
    });
};

/**
 * Power-up collection glow effect
 */
export const animatePowerUpCollect = (element: HTMLElement | null, color: string = 'rgba(16,185,129,0.6)'): void => {
    if (!element) return;

    gsap.fromTo(
        element,
        { filter: `drop-shadow(0 0 0 ${color.replace('0.6', '0')})` },
        {
            filter: `drop-shadow(0 0 16px ${color})`,
            duration: 0.2,
            yoyo: true,
            repeat: 2,
        }
    );
};

/**
 * Shield power-up active glow
 */
export const animateShieldGlow = (element: HTMLElement | null): gsap.core.Tween | null => {
    if (!element) return null;

    return gsap.to(element, {
        filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.7))',
        duration: 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
    });
};

/**
 * Enemy spawn pop-in animation
 */
export const animateEnemySpawn = (element: HTMLElement | null): void => {
    if (!element) return;

    gsap.fromTo(
        element,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' }
    );
};

/**
 * Enemy death pop-out animation
 */
export const animateEnemyDeath = (
    element: HTMLElement | null,
    onComplete?: () => void
): void => {
    if (!element) return;

    gsap.to(element, {
        scale: 0,
        opacity: 0,
        rotation: 360,
        duration: 0.25,
        ease: 'back.in(1.7)',
        onComplete,
    });
};

/**
 * Particle burst effect (for eating fish)
 */
export const createParticleBurst = (
    container: HTMLElement | null,
    x: number,
    y: number,
    color: string = '#10b981'
): void => {
    if (!container) return;

    const particleCount = 8;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        particle.style.pointerEvents = 'none';
        container.appendChild(particle);
        particles.push(particle);

        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 30 + Math.random() * 20;
        const tx = x + Math.cos(angle) * distance;
        const ty = y + Math.sin(angle) * distance;

        gsap.to(particle, {
            x: tx - x,
            y: ty - y,
            opacity: 0,
            scale: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                particle.remove();
            },
        });
    }
};
