import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';

// ===== TYPES =====
interface Question {
    num1: number;
    num2: number;
    answers: number[];
    correctAnswer: number;
}

interface Opponent {
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    color: string;
}

interface GameConfig {
    operations: ('add' | 'subtract')[];
    maxNumber: number;
    raceLength: number;
    opponents: Opponent[];
    questions: Question[];
}

interface Car {
    id: string;
    name: string;
    position: number;
    speed: number;
    lane: number;
    color: string;
    isPlayer: boolean;
    baseSpeed: number;
    boosting: boolean;
}

interface GameState {
    cars: Car[];
    currentQuestionIndex: number;
    isRacing: boolean;
    isGameOver: boolean;
    winner: string | null;
    playerScore: number;
    timeLeft: number;
}

interface Game {
    gameId?: string;
    name?: string;
}

interface GameResult {
    correctAnswers: number;
    totalQuestions: number;
    playDurations: number;
}

interface MathRacingGameProps {
    game: Game;
    config: GameConfig;
    onExit: () => void;
    onFinish?: (result: GameResult) => void;
    submitting?: boolean;
    submitMsg?: string;
}

// ===== MAIN COMPONENT =====
const MathRacingGame: React.FC<MathRacingGameProps> = ({ game, config, onExit, onFinish }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const startTimeRef = useRef(Date.now());
    const questionTimerRef = useRef<number>(0);
    const aiTimersRef = useRef<NodeJS.Timeout[]>([]);

    const raceLength = config.raceLength || 1000;
    const questionTimeLimit = 10; // seconds per question

    // Game State
    const [gameState, setGameState] = useState<GameState>({
        cars: [],
        currentQuestionIndex: 0,
        isRacing: false,
        isGameOver: false,
        winner: null,
        playerScore: 0,
        timeLeft: questionTimeLimit,
    });

    const [showQuestion, setShowQuestion] = useState(false);
    const [canAnswer, setCanAnswer] = useState(true);
    const carsRef = useRef<Car[]>([]);

    // Initialize cars
    useEffect(() => {
        const playerCar: Car = {
            id: 'player',
            name: 'You',
            position: 0,
            speed: 2,
            lane: 2,
            color: '#3b82f6',
            isPlayer: true,
            baseSpeed: 2,
            boosting: false,
        };

        const opponentCars: Car[] = (config.opponents || []).map((opp, idx) => ({
            id: `ai-${idx}`,
            name: opp.name,
            position: 0,
            speed: 2,
            lane: idx === 0 ? 1 : idx === 1 ? 3 : 2,
            color: opp.color || '#ef4444',
            isPlayer: false,
            baseSpeed: 2,
            boosting: false,
        }));

        const allCars = [playerCar, ...opponentCars];
        carsRef.current = allCars;
        setGameState(prev => ({ ...prev, cars: allCars, isRacing: true }));
        setShowQuestion(true);
        questionTimerRef.current = questionTimeLimit;
    }, [config.opponents, questionTimeLimit]);

    // Create particle effect
    const createParticles = useCallback((x: number, y: number, color: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        for (let i = 0; i < 8; i++) {
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

            const angle = (Math.PI * 2 * i) / 8;
            const distance = 30 + Math.random() * 20;
            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => particle.remove(),
            });
        }
    }, []);

    // Handle answer selection
    const handleAnswer = useCallback((answer: number) => {
        if (!canAnswer || gameState.isGameOver) return;

        const currentQuestion = config.questions[gameState.currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        setCanAnswer(false);

        // Update player car
        const playerCar = carsRef.current.find(c => c.isPlayer);
        if (playerCar) {
            if (isCorrect) {
                // Speed boost
                playerCar.boosting = true;
                playerCar.speed = playerCar.baseSpeed * 2.5;

                setGameState(prev => ({ ...prev, playerScore: prev.playerScore + 1 }));

                // Visual feedback
                const canvas = canvasRef.current;
                if (canvas) {
                    createParticles(200, playerCar.lane * 100 + 50, '#10b981');
                }

                // Reset boost after 2 seconds
                setTimeout(() => {
                    playerCar.boosting = false;
                    playerCar.speed = playerCar.baseSpeed;
                }, 2000);
            } else {
                // Slow down
                playerCar.speed = playerCar.baseSpeed * 0.5;

                // Screen shake
                const canvas = canvasRef.current?.parentElement;
                if (canvas) {
                    gsap.fromTo(canvas,
                        { x: 0 },
                        {
                            x: 15,
                            yoyo: true,
                            repeat: 7,
                            duration: 0.05,
                            onComplete: () => { gsap.set(canvas, { x: 0 }); }
                        }
                    );
                }

                // Reset speed after 1.5 seconds
                setTimeout(() => {
                    playerCar.speed = playerCar.baseSpeed;
                }, 1500);
            }
        }

        // Move to next question
        setTimeout(() => {
            setShowQuestion(false);
            setTimeout(() => {
                const nextIndex = gameState.currentQuestionIndex + 1;
                if (nextIndex < config.questions.length) {
                    setGameState(prev => ({
                        ...prev,
                        currentQuestionIndex: nextIndex,
                        timeLeft: questionTimeLimit,
                    }));
                    questionTimerRef.current = questionTimeLimit;
                    setShowQuestion(true);
                    setCanAnswer(true);
                }
            }, 500);
        }, 1000);
    }, [canAnswer, gameState.currentQuestionIndex, gameState.isGameOver, config.questions, questionTimeLimit, createParticles]);

    // AI opponent logic
    useEffect(() => {
        if (!showQuestion || !gameState.isRacing) return;

        // Clear previous timers
        aiTimersRef.current.forEach(timer => clearTimeout(timer));
        aiTimersRef.current = [];

        const currentQuestion = config.questions[gameState.currentQuestionIndex];

        carsRef.current.forEach(car => {
            if (car.isPlayer) return;

            const opponent = config.opponents.find(o => o.name === car.name);
            if (!opponent) return;

            // AI answer delay based on difficulty
            const baseDelay = opponent.difficulty === 'easy' ? 3000 :
                opponent.difficulty === 'medium' ? 2000 : 1000;
            const delay = baseDelay + Math.random() * 2000;

            // AI accuracy based on difficulty
            const accuracy = opponent.difficulty === 'easy' ? 0.5 :
                opponent.difficulty === 'medium' ? 0.7 : 0.85;

            const timer = setTimeout(() => {
                const isCorrect = Math.random() < accuracy;

                if (isCorrect) {
                    car.boosting = true;
                    car.speed = car.baseSpeed * 2;
                    setTimeout(() => {
                        car.boosting = false;
                        car.speed = car.baseSpeed;
                    }, 1800);
                } else {
                    car.speed = car.baseSpeed * 0.6;
                    setTimeout(() => {
                        car.speed = car.baseSpeed;
                    }, 1200);
                }
            }, delay);

            aiTimersRef.current.push(timer);
        });

        return () => {
            aiTimersRef.current.forEach(timer => clearTimeout(timer));
        };
    }, [showQuestion, gameState.currentQuestionIndex, gameState.isRacing, config.questions, config.opponents]);

    // Question timer countdown
    useEffect(() => {
        if (!showQuestion || gameState.isGameOver) return;

        const interval = setInterval(() => {
            questionTimerRef.current -= 0.1;
            setGameState(prev => ({
                ...prev,
                timeLeft: Math.max(0, questionTimerRef.current)
            }));

            if (questionTimerRef.current <= 0) {
                // Time's up - treat as wrong answer
                handleAnswer(-1);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [showQuestion, gameState.isGameOver, handleAnswer]);

    // Game loop
    useEffect(() => {
        if (!gameState.isRacing || gameState.isGameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const gameLoop = () => {
            // Update car positions
            carsRef.current.forEach(car => {
                car.position += car.speed;

                // Check if car reached finish line
                if (car.position >= raceLength && !gameState.isGameOver) {
                    setGameState(prev => ({
                        ...prev,
                        isGameOver: true,
                        isRacing: false,
                        winner: car.name,
                    }));

                    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
                    onFinish?.({
                        correctAnswers: gameState.playerScore,
                        totalQuestions: config.questions.length,
                        playDurations: duration,
                    });
                }
            });

            // Draw
            drawRace(ctx, canvas.width, canvas.height);

            if (gameState.isRacing) {
                animFrameRef.current = requestAnimationFrame(gameLoop);
            }
        };

        animFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [gameState.isRacing, gameState.isGameOver, gameState.playerScore, raceLength, config.questions.length, onFinish]);

    // Draw race
    const drawRace = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#98d8e8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw road
        ctx.fillStyle = '#555';
        ctx.fillRect(0, height * 0.3, width, height * 0.7);

        // Draw lane lines
        const laneHeight = height * 0.7 / 4;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 15]);
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, height * 0.3 + laneHeight * i);
            ctx.lineTo(width, height * 0.3 + laneHeight * i);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw finish line if close
        const maxPosition = Math.max(...carsRef.current.map(c => c.position));
        if (maxPosition > raceLength * 0.8) {
            const finishX = width * 0.9;
            ctx.fillStyle = '#000';
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 2; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillRect(finishX, height * 0.3 + i * (height * 0.7 / 8), 20, height * 0.7 / 8);
                    }
                }
            }
        }

        // Draw cars
        carsRef.current.forEach(car => {
            const progress = car.position / raceLength;
            const x = 50 + progress * (width - 150);
            const y = height * 0.3 + car.lane * laneHeight - laneHeight / 2;

            // Draw exhaust smoke when boosting
            if (car.boosting) {
                ctx.fillStyle = 'rgba(150,150,150,0.3)';
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(x - 20 - i * 10, y + 10, 5 + i * 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Speed lines
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.moveTo(x - 40 - i * 15, y - 10 + i * 5);
                    ctx.lineTo(x - 20 - i * 15, y - 10 + i * 5);
                    ctx.stroke();
                }
            }

            // Draw car body
            ctx.fillStyle = car.color;
            ctx.fillRect(x, y, 60, 30);

            // Car top
            ctx.fillStyle = car.isPlayer ? '#1e40af' : '#991b1b';
            ctx.fillRect(x + 15, y - 8, 30, 20);

            // Wheels
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 5, y + 28, 12, 8);
            ctx.fillRect(x + 43, y + 28, 12, 8);

            // Car name
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(car.name, x, y - 15);

            // Position indicator
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            const position = carsRef.current
                .sort((a, b) => b.position - a.position)
                .findIndex(c => c.id === car.id) + 1;
            ctx.fillText(`#${position}`, x + 25, y + 20);
        });
    };

    // Resize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const currentQuestion = config.questions[gameState.currentQuestionIndex];
    const playerPosition = carsRef.current
        .sort((a, b) => b.position - a.position)
        .findIndex(c => c.isPlayer) + 1;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        🏎️ {game?.name || 'Math Racing'}
                    </div>
                    <div className="text-lg font-extrabold text-slate-900">Đua Xe Toán Học</div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const elem = document.documentElement;
                            if (!document.fullscreenElement) {
                                elem.requestFullscreen().catch(err => console.log(err));
                            } else {
                                document.exitFullscreen();
                            }
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        title="Fullscreen"
                    >
                        <i className="fa-solid fa-expand" />
                    </button>
                    <button
                        onClick={onExit}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <i className="fa-solid fa-arrow-left mr-2" />
                        Thoát
                    </button>
                </div>
            </div>

            {/* Race Track */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-slate-300" style={{ height: '400px' }}>
                <canvas ref={canvasRef} className="w-full h-full" />

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 right-4 pointer-events-none flex justify-between">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border-2 border-blue-200">
                        <div className="text-xs font-bold text-slate-600">Vị trí</div>
                        <div className="text-2xl font-extrabold text-blue-600">#{playerPosition}</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border-2 border-emerald-200">
                        <div className="text-xs font-bold text-slate-600">Điểm</div>
                        <div className="text-2xl font-extrabold text-emerald-600">{gameState.playerScore}</div>
                    </div>
                </div>

                {/* Question Modal */}
                {showQuestion && !gameState.isGameOver && currentQuestion && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm pointer-events-auto">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 border-4 border-blue-300">
                            {/* Timer Bar */}
                            <div className="mb-4 h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-100"
                                    style={{ width: `${(gameState.timeLeft / questionTimeLimit) * 100}%` }}
                                />
                            </div>

                            <div className="text-center mb-6">
                                <div className="text-4xl font-extrabold text-slate-900 mb-2">
                                    {currentQuestion.num1} {config.operations.includes('add') ? '+' : '-'} {currentQuestion.num2} = ?
                                </div>
                                <div className="text-sm text-slate-600">
                                    <i className="fa-solid fa-clock mr-2" />
                                    {Math.ceil(gameState.timeLeft)}s
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {currentQuestion.answers.map((answer, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(answer)}
                                        disabled={!canAnswer}
                                        className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4 text-2xl font-extrabold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Game Over */}
                {gameState.isGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-md">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 border-4 border-amber-300">
                            <div className="text-center">
                                <div className="mb-4">
                                    <i className={`text-7xl ${gameState.winner === 'You' ? 'fa-solid fa-trophy text-amber-400' : 'fa-solid fa-flag-checkered text-slate-500'}`} />
                                </div>
                                <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {gameState.winner === 'You' ? '🎉 Chiến Thắng!' : '🏁 Kết Thúc!'}
                                </h2>
                                <p className="text-base text-slate-700 mb-6">
                                    Người chiến thắng: <span className="font-bold">{gameState.winner}</span>
                                </p>

                                <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                                    <div className="text-sm font-bold text-slate-600 mb-2">Bảng Xếp Hạng</div>
                                    {carsRef.current
                                        .sort((a, b) => b.position - a.position)
                                        .map((car, idx) => (
                                            <div key={car.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-bold text-slate-700">#{idx + 1}</div>
                                                    <div className={car.isPlayer ? 'font-bold text-blue-600' : 'text-slate-600'}>
                                                        {car.name}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {Math.round((car.position / raceLength) * 100)}%
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-base font-bold text-white shadow-xl hover:scale-105 transition-all"
                                    >
                                        <i className="fa-solid fa-rotate-right mr-2" />
                                        Đua Lại
                                    </button>
                                    <button
                                        onClick={onExit}
                                        className="flex-1 rounded-2xl border-3 border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 hover:bg-slate-100 transition-all"
                                    >
                                        <i className="fa-solid fa-home mr-2" />
                                        Về Nhà
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Progress bars */}
            <div className="mt-4 space-y-2">
                {carsRef.current
                    .sort((a, b) => b.position - a.position)
                    .map((car, idx) => (
                        <div key={car.id} className="flex items-center gap-2">
                            <div className={`text-xs font-bold ${car.isPlayer ? 'text-blue-600' : 'text-slate-600'} w-16`}>
                                #{idx + 1} {car.name}
                            </div>
                            <div className="flex-1 h-6 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min((car.position / raceLength) * 100, 100)}%`,
                                        backgroundColor: car.color
                                    }}
                                />
                            </div>
                            <div className="text-xs font-semibold text-slate-600 w-12">
                                {Math.round((car.position / raceLength) * 100)}%
                            </div>
                        </div>
                    ))}
            </div>

            {/* Game Over / Victory Screen */}
            {gameState.isGameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/80 to-slate-800/90 backdrop-blur-lg z-40 p-2">
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl max-w-xl w-full border-4 border-amber-400">
                        <div className="text-center">
                            <div className="mb-4 animate-bounce">
                                <i className={`text-6xl md:text-8xl ${gameState.winner === carsRef.current.find(c => c.isPlayer)?.name ? 'fa-solid fa-trophy text-amber-400 drop-shadow-xl' : 'fa-solid fa-flag-checkered text-slate-600'}`} />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {gameState.winner === carsRef.current.find(c => c.isPlayer)?.name ? '🎉 Chiến Thắng!' : '🏁 Hoàn Thành!'}
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 mb-6 md:mb-8 font-semibold">
                                Người chiến thắng: <span className="font-black text-blue-600">{gameState.winner}</span>
                            </p>

                            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border-2 border-slate-200">
                                <div className="text-xs md:text-sm font-bold text-slate-700 mb-3 md:mb-4 uppercase tracking-wide">🏆 Bảng Xếp Hạng</div>
                                {carsRef.current
                                    .sort((a, b) => b.position - a.position)
                                    .map((car, idx) => (
                                        <div key={car.id} className="flex items-center justify-between py-2 md:py-3 border-b last:border-0 border-slate-200">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className={`text-xl md:text-2xl font-black ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-600' : 'text-slate-500'}`}>
                                                    #{idx + 1}
                                                </div>
                                                <div className={car.isPlayer ? 'font-black text-blue-600 text-base md:text-lg' : 'text-slate-700 font-semibold text-sm md:text-base'}>
                                                    {car.name}
                                                </div>
                                            </div>
                                            <div className="text-xs md:text-sm font-bold text-slate-600 bg-white px-2 md:px-3 py-1 rounded-full">
                                                {Math.round((car.position / raceLength) * 100)}%
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-black text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                >
                                    <i className="fa-solid fa-rotate-right mr-2" />
                                    Đua Lại
                                </button>
                                <button
                                    onClick={onExit}
                                    className="flex-1 rounded-2xl border-4 border-slate-300 bg-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-black text-slate-700 hover:bg-slate-100 hover:scale-105 transition-all shadow-lg"
                                >
                                    <i className="fa-solid fa-home mr-2" />
                                    Về Nhà
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MathRacingGame;
