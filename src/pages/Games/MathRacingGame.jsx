import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';

// Math Racing Game - JSX Version
// Professional arcade racing game with math questions

const MathRacingGame = ({ game, config, onExit, onFinish }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const questionTimerRef = useRef(0);
  const aiTimersRef = useRef([]);

  const raceLength = (config.raceLength || 1000) * 50; // Scale up small values
  const questionTimeLimit = 10; // seconds

  // Game State
  const [gameState, setGameState] = useState({
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
  const carsRef = useRef([]);

  // Initialize cars
  useEffect(() => {
    const playerCar = {
      id: 'player',
      name: 'Bạn',
      position: 0,
      speed: 2,
      lane: 2,
      color: '#3b82f6',
      isPlayer: true,
      baseSpeed: 2,
      boosting: false,
    };

    // Generate opponents based on config
    let opponentCars = [];

    if (Array.isArray(config.opponents)) {
      // Backend sent array of opponent objects
      opponentCars = config.opponents.map((opp, idx) => ({
        id: `ai-${idx}`,
        name: opp.name,
        position: 0,
        speed: 2,
        lane: idx === 0 ? 1 : idx === 1 ? 3 : 2,
        color: opp.color || '#ef4444',
        isPlayer: false,
        baseSpeed: 2,
        boosting: false,
        difficulty: opp.difficulty,
      }));
    } else if (typeof config.opponents === 'number' && config.opponents > 0) {
      // Backend sent number - auto-generate opponents
      const opponentNames = ['Xe Đỏ', 'Xe Xanh', 'Xe Vàng', 'Xe Cam', 'Xe Tím'];
      const opponentColors = ['#ef4444', '#3b82f6', '#eab308', '#f97316', '#a855f7'];
      const difficulties = ['easy', 'medium', 'hard'];

      for (let i = 0; i < Math.min(config.opponents, 5); i++) {
        opponentCars.push({
          id: `ai-${i}`,
          name: opponentNames[i],
          position: 0,
          speed: 2,
          lane: i === 0 ? 1 : i === 1 ? 3 : i === 2 ? 0 : 2,
          color: opponentColors[i],
          isPlayer: false,
          baseSpeed: 2,
          boosting: false,
          difficulty: difficulties[i % 3],
        });
      }
    }

    const allCars = [playerCar, ...opponentCars];
    carsRef.current = allCars;
    setGameState(prev => ({ ...prev, cars: allCars, isRacing: true }));
    setShowQuestion(true);
    questionTimerRef.current = questionTimeLimit;
  }, [config.opponents, questionTimeLimit]);

  // Create particle effect
  const createParticles = useCallback((x, y, color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = color;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '10';
      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / 10;
      const distance = 40 + Math.random() * 30;
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  }, []);

  // Handle answer selection
  const handleAnswer = useCallback((answer) => {
    if (!canAnswer || gameState.isGameOver) return;

    const questions = Array.isArray(config.questions) ? config.questions : [];
    const currentQuestion = questions[gameState.currentQuestionIndex];
    if (!currentQuestion) return;
    const isCorrect = answer === currentQuestion.correctAnswer;

    setCanAnswer(false);

    const playerCar = carsRef.current.find(c => c.isPlayer);
    if (playerCar) {
      if (isCorrect) {
        // Speed boost
        playerCar.boosting = true;
        playerCar.speed = playerCar.baseSpeed * 2.8;

        setGameState(prev => ({ ...prev, playerScore: prev.playerScore + 1 }));

        // Particle effect
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          createParticles(200, rect.height * 0.5, '#10b981');
        }

        // Reset boost after 2.5 seconds
        setTimeout(() => {
          playerCar.boosting = false;
          playerCar.speed = playerCar.baseSpeed;
        }, 2500);
      } else {
        // Slow down
        playerCar.speed = playerCar.baseSpeed * 0.4;

        // Screen shake
        const container = canvasRef.current?.parentElement;
        if (container) {
          gsap.fromTo(container,
            { x: 0 },
            {
              x: 15,
              yoyo: true,
              repeat: 8,
              duration: 0.045,
              ease: 'power1.inOut',
              onComplete: () => { gsap.set(container, { x: 0 }); }
            }
          );
        }

        // Reset speed
        setTimeout(() => {
          playerCar.speed = playerCar.baseSpeed;
        }, 1800);
      }
    }

    // Next question
    setTimeout(() => {
      setShowQuestion(false);
      setTimeout(() => {
        const nextIndex = gameState.currentQuestionIndex + 1;
        const questions = Array.isArray(config.questions) ? config.questions : [];
        if (nextIndex < questions.length) {
          setGameState(prev => ({
            ...prev,
            currentQuestionIndex: nextIndex,
            timeLeft: questionTimeLimit,
          }));
          questionTimerRef.current = questionTimeLimit;
          setShowQuestion(true);
          setCanAnswer(true);
        }
      }, 800);
    }, 1200);
  }, [canAnswer, gameState, config.questions, questionTimeLimit, createParticles]);

  // AI logic
  useEffect(() => {
    if (!showQuestion || !gameState.isRacing) return;

    aiTimersRef.current.forEach(timer => clearTimeout(timer));
    aiTimersRef.current = [];

    carsRef.current.forEach(car => {
      if (car.isPlayer) return;

      const baseDelay = car.difficulty === 'easy' ? 3500 :
        car.difficulty === 'medium' ? 2200 : 1200;
      const delay = baseDelay + Math.random() * 2000;

      const accuracy = car.difficulty === 'easy' ? 0.55 :
        car.difficulty === 'medium' ? 0.75 : 0.88;

      const timer = setTimeout(() => {
        const isCorrect = Math.random() < accuracy;

        if (isCorrect) {
          car.boosting = true;
          car.speed = car.baseSpeed * 2.2;
          setTimeout(() => {
            car.boosting = false;
            car.speed = car.baseSpeed;
          }, 2000);
        } else {
          car.speed = car.baseSpeed * 0.55;
          setTimeout(() => {
            car.speed = car.baseSpeed;
          }, 1500);
        }
      }, delay);

      aiTimersRef.current.push(timer);
    });

    return () => {
      aiTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [showQuestion, gameState.currentQuestionIndex, gameState.isRacing]);

  // Question timer
  useEffect(() => {
    if (!showQuestion || gameState.isGameOver) return;

    const interval = setInterval(() => {
      questionTimerRef.current -= 0.1;
      setGameState(prev => ({
        ...prev,
        timeLeft: Math.max(0, questionTimerRef.current)
      }));

      if (questionTimerRef.current <= 0) {
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
      // Update positions
      carsRef.current.forEach(car => {
        car.position += car.speed;

        // Check finish
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
            totalQuestions: Array.isArray(config.questions) ? config.questions.length : 0,
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
  }, [gameState.isRacing, gameState.isGameOver, gameState.playerScore, raceLength, onFinish]);

  // Draw race
  const drawRace = (ctx, width, height) => {
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.3);
    skyGrad.addColorStop(0, '#87ceeb');
    skyGrad.addColorStop(1, '#b0e0e6');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.3);

    // Grass
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(0, height * 0.3, width, 20);
    ctx.fillRect(0, height - 20, width, 20);

    // Road
    const roadGrad = ctx.createLinearGradient(0, height * 0.3 + 20, 0, height - 20);
    roadGrad.addColorStop(0, '#444');
    roadGrad.addColorStop(0.5, '#555');
    roadGrad.addColorStop(1, '#444');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, height * 0.3 + 20, width, height * 0.7 - 40);

    // Lane lines
    const laneHeight = (height * 0.7 - 40) / 4;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.setLineDash([25, 20]);
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, height * 0.3 + 20 + laneHeight * i);
      ctx.lineTo(width, height * 0.3 + 20 + laneHeight * i);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Finish line
    const maxPos = Math.max(...carsRef.current.map(c => c.position));
    if (maxPos > raceLength * 0.75) {
      const finishX = width * 0.88;
      ctx.fillStyle = '#fff';
      ctx.fillRect(finishX - 2, height * 0.3, 4, height * 0.7);

      // Checkered pattern
      const checkSize = (height * 0.7) / 12;
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 2; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillStyle = '#000';
          } else {
            ctx.fillStyle = '#fff';
          }
          ctx.fillRect(finishX + 2 + j * 15, height * 0.3 + i * checkSize, 15, checkSize);
        }
      }
    }

    // Draw cars
    carsRef.current.forEach(car => {
      const progress = Math.min(car.position / raceLength, 1);
      const x = 80 + progress * (width - 200);
      const y = height * 0.3 + 20 + car.lane * laneHeight - laneHeight / 2 - 15;

      // Exhaust smoke when boosting
      if (car.boosting) {
        ctx.fillStyle = 'rgba(120,120,120,0.25)';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(x - 25 - i * 12, y + 15, 6 + i * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Speed lines
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x - 50 - i * 18, y - 8 + i * 8);
          ctx.lineTo(x - 25 - i * 18, y - 8 + i * 8);
          ctx.stroke();
        }
      }

      // Car shadow (soft oval)
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(x + 35, y + 40, 32, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car dimensions
      const carWidth = 70;
      const carHeight = 32;

      // Main body shape - aerodynamic racing car
      const bodyGradient = ctx.createLinearGradient(x, y + 5, x, y + carHeight);
      bodyGradient.addColorStop(0, lightenColor(car.color, 0.4));
      bodyGradient.addColorStop(0.5, car.color);
      bodyGradient.addColorStop(1, darkenColor(car.color, 0.2));
      ctx.fillStyle = bodyGradient;

      // Aerodynamic body path
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 10);
      ctx.quadraticCurveTo(x, y + 16, x + 2, y + 22);
      ctx.lineTo(x + 2, y + 24);
      ctx.quadraticCurveTo(x + 3, y + carHeight, x + 12, y + carHeight);
      ctx.lineTo(x + carWidth - 12, y + carHeight);
      ctx.quadraticCurveTo(x + carWidth - 3, y + carHeight, x + carWidth - 2, y + 24);
      ctx.lineTo(x + carWidth - 2, y + 22);
      ctx.quadraticCurveTo(x + carWidth, y + 16, x + carWidth - 5, y + 10);
      ctx.quadraticCurveTo(x + carWidth - 10, y, x + carWidth - 15, y);
      ctx.lineTo(x + 15, y);
      ctx.quadraticCurveTo(x + 10, y, x + 5, y + 10);
      ctx.closePath();
      ctx.fill();

      // Body outline
      ctx.strokeStyle = darkenColor(car.color, 0.3);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hood reflection streak
      const reflectionGrad = ctx.createLinearGradient(x + 15, y + 2, x + 50, y + 12);
      reflectionGrad.addColorStop(0, 'rgba(255,255,255,0)');
      reflectionGrad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
      reflectionGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = reflectionGrad;
      ctx.fillRect(x + 15, y + 2, 35, 8);

      // Rear spoiler
      ctx.fillStyle = darkenColor(car.color, 0.25);
      ctx.fillRect(x - 4, y + 11, 4, 11);
      ctx.fillRect(x - 6, y + 11, 2, 1);
      ctx.fillRect(x - 6, y + 21, 2, 1);

      // Hood vents
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let i = 0; i < 2; i++) {
        ctx.fillRect(x + 48 + i * 6, y + 4, 3, 1);
        ctx.fillRect(x + 48 + i * 6, y + 7, 3, 1);
      }

      // Cabin/cockpit
      const cabinGrad = ctx.createRadialGradient(x + 28, y + 12, 2, x + 28, y + 16, 15);
      cabinGrad.addColorStop(0, car.isPlayer ? '#2563eb' : darkenColor(car.color, 0.4));
      cabinGrad.addColorStop(1, car.isPlayer ? '#1e40af' : darkenColor(car.color, 0.5));
      ctx.fillStyle = cabinGrad;
      ctx.beginPath();
      ctx.moveTo(x + 18, y + 8);
      ctx.lineTo(x + 42, y + 8);
      ctx.quadraticCurveTo(x + 46, y + 9, x + 47, y + 12);
      ctx.lineTo(x + 47, y + 20);
      ctx.quadraticCurveTo(x + 46, y + 23, x + 42, y + 24);
      ctx.lineTo(x + 18, y + 24);
      ctx.quadraticCurveTo(x + 14, y + 23, x + 13, y + 20);
      ctx.lineTo(x + 13, y + 12);
      ctx.quadraticCurveTo(x + 14, y + 9, x + 18, y + 8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Windshield with reflection
      ctx.fillStyle = 'rgba(150,200,255,0.5)';
      ctx.fillRect(x + 37, y + 11, 8, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(x + 37, y + 11, 8, 3);

      // Side windows
      ctx.fillStyle = 'rgba(150,200,255,0.4)';
      ctx.fillRect(x + 16, y + 13, 8, 6);
      ctx.fillRect(x + 26, y + 13, 8, 6);

      // Side mirrors
      ctx.fillStyle = darkenColor(car.color, 0.2);
      ctx.fillRect(x + 12, y + 12, 2, 4);
      ctx.fillRect(x + 46, y + 12, 2, 4);
      ctx.fillStyle = 'rgba(150,200,255,0.3)';
      ctx.fillRect(x + 12, y + 13, 2, 2);
      ctx.fillRect(x + 46, y + 13, 2, 2);

      // Wheels with detailed rims
      const wheelY = y + carHeight - 3;
      [x + 16, x + 54].forEach(wx => {
        // Tire outer
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Tire tread
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rim - metallic
        const rimGrad = ctx.createRadialGradient(wx - 1, wheelY - 1, 1, wx, wheelY, 5);
        rimGrad.addColorStop(0, '#e5e5e5');
        rimGrad.addColorStop(0.7, '#aaa');
        rimGrad.addColorStop(1, '#888');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(wx, wheelY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Rim spokes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 / 5) * i;
          ctx.beginPath();
          ctx.moveTo(wx, wheelY);
          ctx.lineTo(wx + Math.cos(angle) * 4.5, wheelY + Math.sin(angle) * 4.5);
          ctx.stroke();
        }

        // Center cap
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(wx - 2, wheelY - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Headlights with glow
      const lightColor = car.boosting ? '#ffeb3b' : '#ffffcc';
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(x + carWidth - 2, y + 10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + carWidth - 2, y + 22, 3, 0, Math.PI * 2);
      ctx.fill();

      // Headlight glow/halo
      if (car.boosting) {
        ctx.fillStyle = 'rgba(255,235,59,0.4)';
        ctx.beginPath();
        ctx.arc(x + carWidth - 2, y + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + carWidth - 2, y + 22, 6, 0, Math.PI * 2);
        ctx.fill();

        // Exhaust flames when boosting
        ctx.fillStyle = 'rgba(255,120,0,0.7)';
        ctx.beginPath();
        ctx.ellipse(x - 5, y + 14, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,200,0,0.7)';
        ctx.beginPath();
        ctx.ellipse(x - 5, y + 18, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Exhaust pipes
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(x - 2, y + 13, 3, 2);
      ctx.fillRect(x - 2, y + 17, 3, 2);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x - 2, y + 13, 3, 2);
      ctx.strokeRect(x - 2, y + 17, 3, 2);

      // Racing stripes for player
      if (car.isPlayer) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(x + 8, y + 15, 50, 1);
        ctx.fillRect(x + 8, y + 17, 50, 1);
      }

      // Position badge
      const position = carsRef.current
        .sort((a, b) => b.position - a.position)
        .findIndex(c => c.id === car.id) + 1;

      const badgeColors = ['#fbbf24', '#c0c0c0', '#cd7f32', '#94a3b8'];
      const badgeColor = badgeColors[position - 1] || '#94a3b8';

      // Badge shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.arc(x + 31, y + 7, 9, 0, Math.PI * 2);
      ctx.fill();

      // Badge
      const badgeGrad = ctx.createRadialGradient(x + 30, y + 5, 2, x + 30, y + 6, 9);
      badgeGrad.addColorStop(0, lightenColor(badgeColor, 0.3));
      badgeGrad.addColorStop(1, badgeColor);
      ctx.fillStyle = badgeGrad;
      ctx.beginPath();
      ctx.arc(x + 30, y + 6, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Badge number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.fillText(`${position}`, x + 30, y + 6);
      ctx.shadowBlur = 0;

      // Name label with background
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      const nameWidth = ctx.measureText(car.name).width + 10;
      ctx.fillRect(x, y - 20, nameWidth, 16);
      ctx.fillStyle = car.isPlayer ? '#60a5fa' : '#fff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(car.name, x + 5, y - 12);
    });
  };

  // Helper to lighten color
  const lightenColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + (255 - parseInt(hex.substr(0, 2), 16)) * amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + (255 - parseInt(hex.substr(2, 2), 16)) * amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + (255 - parseInt(hex.substr(4, 2), 16)) * amount);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  // Helper to darken color
  const darkenColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
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

  const questions = Array.isArray(config.questions) ? config.questions : [];
  const currentQuestion = questions[gameState.currentQuestionIndex];
  const playerPosition = carsRef.current
    .sort((a, b) => b.position - a.position)
    .findIndex(c => c.isPlayer) + 1;

  const operation = config.operations?.includes?.('add') ? '+' :
    config.operations?.includes?.('subtract') ? '-' : '+';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            🏎️ {game?.name || 'Đua Xe Toán Học'}
          </div>
          <div className="text-lg font-extrabold text-slate-900">Math Racing Championship</div>
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            title="Fullscreen"
          >
            <i className="fa-solid fa-expand" />
          </button>
          <button
            onClick={onExit}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <i className="fa-solid fa-arrow-left mr-2" />
            Thoát
          </button>
        </div>
      </div>

      {/* Race Track */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-slate-300 shadow-xl" style={{ height: '450px' }}>
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* HUD */}
        <div className="absolute top-4 left-4 right-4 pointer-events-none flex justify-between z-20">
          <div className="bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border-3 border-blue-300">
            <div className="text-xs font-bold text-slate-600 mb-1">Vị Trí</div>
            <div className="text-3xl font-black text-blue-600">#{playerPosition}</div>
          </div>
          <div className="bg-gradient-to-br from-white to-emerald-50 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border-3 border-emerald-300">
            <div className="text-xs font-bold text-slate-600 mb-1">Điểm Số</div>
            <div className="text-3xl font-black text-emerald-600">{gameState.playerScore}</div>
          </div>
        </div>

        {/* Question Modal */}
        {showQuestion && !gameState.isGameOver && currentQuestion && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900/60 to-slate-900/80 backdrop-blur-md pointer-events-auto z-30">
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg w-full mx-4 border-4 border-blue-400 transform scale-105">
              {/* Timer */}
              <div className="mb-6 h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-all duration-100"
                  style={{ width: `${(gameState.timeLeft / questionTimeLimit) * 100}%` }}
                />
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-black text-slate-900 mb-3 drop-shadow-md">
                  {currentQuestion.num1} {operation} {currentQuestion.num2} = ?
                </div>
                <div className="text-base font-semibold text-slate-600 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-stopwatch text-red-500" />
                  <span className="text-red-600 font-bold">{Math.ceil(gameState.timeLeft)}s</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.answers.map((answer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(answer)}
                    disabled={!canAnswer}
                    className="rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 px-8 py-5 text-3xl font-black text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white/30"
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/80 to-slate-800/90 backdrop-blur-lg z-40 p-2">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl max-w-xl w-full border-4 border-amber-400">
              <div className="text-center">
                <div className="mb-4 animate-bounce">
                  <i className={`text-6xl md:text-8xl ${gameState.winner === 'Bạn' ? 'fa-solid fa-trophy text-amber-400 drop-shadow-xl' : 'fa-solid fa-flag-checkered text-slate-600'}`} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {gameState.winner === 'Bạn' ? '🎉 Chiến Thắng!' : '🏁 Hoàn Thành!'}
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

      {/* Progress Bars */}
      <div className="mt-6 space-y-3">
        <div className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
          <i className="fa-solid fa-chart-line mr-2 text-blue-500" />
          Tiến Độ Đua
        </div>
        {carsRef.current
          .sort((a, b) => b.position - a.position)
          .map((car, idx) => (
            <div key={car.id} className="flex items-center gap-3">
              <div className={`text-sm font-black ${car.isPlayer ? 'text-blue-600' : 'text-slate-600'} w-20`}>
                #{idx + 1} {car.name}
              </div>
              <div className="flex-1 h-7 bg-slate-200 rounded-full overflow-hidden shadow-inner border-2 border-slate-300">
                <div
                  className="h-full transition-all duration-300 shadow-lg"
                  style={{
                    width: `${Math.min((car.position / raceLength) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${car.color}, ${darkenColor(car.color, 0.2)})`
                  }}
                />
              </div>
              <div className="text-sm font-bold text-slate-700 w-14 text-right">
                {Math.round((car.position / raceLength) * 100)}%
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MathRacingGame;
