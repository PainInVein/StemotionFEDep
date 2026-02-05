import type { GameState } from '../types/game.types';

interface GameHUDProps {
    gameState: GameState;
    playerNumber: number;
    maxLives: number;
}

export const GameHUD = ({ gameState, playerNumber, maxLives }: GameHUDProps) => {
    const { lives, score, activePowerUps } = gameState;

    return (
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
            <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left side - Lives and Number */}
                <div className="flex flex-col gap-2">
                    {/* Lives */}
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: maxLives }).map((_, index) => (
                                <i
                                    key={index}
                                    className={`fa-solid fa-heart text-lg ${index < lives ? 'text-rose-500' : 'text-rose-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-rose-700">
                            {lives}/{maxLives}
                        </span>
                    </div>

                    {/* Current Number */}
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                        <i className="fa-solid fa-hashtag text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                            Current Number
                        </span>
                        <span className="text-lg font-extrabold text-blue-900">{playerNumber}</span>
                    </div>
                </div>

                {/* Right side - Score and Power-ups */}
                <div className="flex flex-col gap-2 items-end">
                    {/* Score */}
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                        <i className="fa-solid fa-star text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                            Score
                        </span>
                        <span className="text-lg font-extrabold text-emerald-900">{score}</span>
                    </div>

                    {/* Power-ups */}
                    {activePowerUps.shield > 0 && (
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm animate-pulse">
                            <i className="fa-solid fa-shield text-purple-600" />
                            <span className="text-xs font-bold text-purple-700">
                                Shield x{activePowerUps.shield}
                            </span>
                        </div>
                    )}

                    {activePowerUps.speedBoost > Date.now() && (
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm animate-pulse">
                            <i className="fa-solid fa-bolt text-amber-600" />
                            <span className="text-xs font-bold text-amber-700">Speed Boost</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls hint */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 shadow-sm text-xs font-medium text-slate-600">
                <i className="fa-solid fa-keyboard" />
                <span>WASD or Arrow Keys to move</span>
            </div>
        </div>
    );
};

interface GameOverOverlayProps {
    score: number;
    totalEnemies: number;
    isVictory: boolean;
    onRestart: () => void;
    onExit: () => void;
}

export const GameOverOverlay = ({
    score,
    totalEnemies,
    isVictory,
    onRestart,
    onExit,
}: GameOverOverlayProps) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl max-w-md w-full mx-4">
                <div className="text-center">
                    {/* Icon */}
                    <div className="mb-4">
                        {isVictory ? (
                            <i className="fa-solid fa-trophy text-6xl text-amber-500" />
                        ) : (
                            <i className="fa-solid fa-heart-crack text-6xl text-rose-500" />
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        {isVictory ? 'Victory!' : 'Game Over'}
                    </h2>

                    <p className="text-sm text-slate-600 mb-6">
                        {isVictory
                            ? 'Bạn đã ăn hết tất cả các con cá!'
                            : 'Bạn đã hết mạng. Thử lại nhé!'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-emerald-600">{score}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Fish Eaten
                            </div>
                        </div>
                        <div className="text-slate-300">/</div>
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-slate-700">{totalEnemies}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Total Fish
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onRestart}
                            className="flex-1 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"
                        >
                            <i className="fa-solid fa-rotate-right mr-2" />
                            Play Again
                        </button>
                        <button
                            onClick={onExit}
                            className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            <i className="fa-solid fa-arrow-left mr-2" />
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// import React from 'react';
// import type { GameState } from '../types/game.types';

// interface GameHUDProps {
//     gameState: GameState;
//     playerNumber: number;
//     maxLives: number;
// }

// export const GameHUD: React.FC<GameHUDProps> = ({ gameState, playerNumber, maxLives }) => {
//     const { lives, score, activePowerUps } = gameState;

//     return (
//         <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
//             <div className="flex flex-wrap items-start justify-between gap-3">
//                 {/* Left side - Lives and Number */}
//                 <div className="flex flex-col gap-2">
//                     {/* Lives */}
//                     <div className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
//                         <div className="flex items-center gap-1">
//                             {Array.from({ length: maxLives }).map((_, index) => (
//                                 <i
//                                     key={index}
//                                     className={`fa-solid fa-heart text-lg ${index < lives ? 'text-rose-500' : 'text-rose-200'
//                                         }`}
//                                 />
//                             ))}
//                         </div>
//                         <span className="text-xs font-bold text-rose-700">
//                             {lives}/{maxLives}
//                         </span>
//                     </div>

//                     {/* Current Number */}
//                     <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
//                         <i className="fa-solid fa-hashtag text-blue-600" />
//                         <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
//                             Current Number
//                         </span>
//                         <span className="text-lg font-extrabold text-blue-900">{playerNumber}</span>
//                     </div>
//                 </div>

//                 {/* Right side - Score and Power-ups */}
//                 <div className="flex flex-col gap-2 items-end">
//                     {/* Score */}
//                     <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm">
//                         <i className="fa-solid fa-star text-emerald-600" />
//                         <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
//                             Score
//                         </span>
//                         <span className="text-lg font-extrabold text-emerald-900">{score}</span>
//                     </div>

//                     {/* Power-ups */}
//                     {activePowerUps.shield > 0 && (
//                         <div className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm animate-pulse">
//                             <i className="fa-solid fa-shield text-purple-600" />
//                             <span className="text-xs font-bold text-purple-700">
//                                 Shield x{activePowerUps.shield}
//                             </span>
//                         </div>
//                     )}

//                     {activePowerUps.speedBoost > Date.now() && (
//                         <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/90 backdrop-blur-sm px-4 py-2.5 shadow-sm animate-pulse">
//                             <i className="fa-solid fa-bolt text-amber-600" />
//                             <span className="text-xs font-bold text-amber-700">Speed Boost</span>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Controls hint */}
//             <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 shadow-sm text-xs font-medium text-slate-600">
//                 <i className="fa-solid fa-keyboard" />
//                 <span>WASD or Arrow Keys to move</span>
//             </div>
//         </div>
//     );
// };

// interface GameOverOverlayProps {
//     score: number;
//     totalEnemies: number;
//     isVictory: boolean;
//     onRestart: () => void;
//     onExit: () => void;
// }

// export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
//     score,
//     totalEnemies,
//     isVictory,
//     onRestart,
//     onExit,
// }) => {
//     return (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
//             <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl max-w-md w-full mx-4">
//                 <div className="text-center">
//                     {/* Icon */}
//                     <div className="mb-4">
//                         {isVictory ? (
//                             <i className="fa-solid fa-trophy text-6xl text-amber-500" />
//                         ) : (
//                             <i className="fa-solid fa-heart-crack text-6xl text-rose-500" />
//                         )}
//                     </div>

//                     {/* Title */}
//                     <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
//                         {isVictory ? 'Victory!' : 'Game Over'}
//                     </h2>

//                     <p className="text-sm text-slate-600 mb-6">
//                         {isVictory
//                             ? 'Bạn đã ăn hết tất cả các con cá!'
//                             : 'Bạn đã hết mạng. Thử lại nhé!'}
//                     </p>

//                     {/* Stats */}
//                     <div className="flex items-center justify-center gap-6 mb-8">
//                         <div className="text-center">
//                             <div className="text-3xl font-extrabold text-emerald-600">{score}</div>
//                             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                                 Fish Eaten
//                             </div>
//                         </div>
//                         <div className="text-slate-300">/</div>
//                         <div className="text-center">
//                             <div className="text-3xl font-extrabold text-slate-700">{totalEnemies}</div>
//                             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                                 Total Fish
//                             </div>
//                         </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex gap-3">
//                         <button
//                             onClick={onRestart}
//                             className="flex-1 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"
//                         >
//                             <i className="fa-solid fa-rotate-right mr-2" />
//                             Play Again
//                         </button>
//                         <button
//                             onClick={onExit}
//                             className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
//                         >
//                             <i className="fa-solid fa-arrow-left mr-2" />
//                             Exit
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
