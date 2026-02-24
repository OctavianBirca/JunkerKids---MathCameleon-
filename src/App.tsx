import { useState, useEffect, useRef, RefObject, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Star, Maximize, Minimize } from 'lucide-react';

type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
  options: number[];
};

function generateProblem(level: number): Problem {
  let num1 = 0, num2 = 0, answer = 0, operator: '+' | '-' = '+';
  let max = 10;

  if (level <= 3) max = 10;
  else if (level <= 6) max = 20;
  else if (level <= 9) max = 50;
  else if (level <= 12) max = 100;

  const type = (level - 1) % 3; // 0: Add, 1: Sub, 2: Mix

  if (type === 0 || (type === 2 && Math.random() > 0.5)) {
    // Addition
    operator = '+';
    num1 = Math.floor(Math.random() * (max - 1)) + 1;
    num2 = Math.floor(Math.random() * (max - num1)) + 1;
    answer = num1 + num2;
  } else {
    // Subtraction
    operator = '-';
    num1 = Math.floor(Math.random() * max) + 1; // 1 to max
    num2 = Math.floor(Math.random() * num1) + 1; // 1 to num1
    if (num2 > num1) num2 = num1;
    answer = num1 - num2;
  }

  const options = new Set<number>();
  options.add(answer);
  while (options.size < 4) {
    const offsetRange = max <= 20 ? 4 : 10;
    const offset = Math.floor(Math.random() * (offsetRange * 2 + 1)) - offsetRange;
    const wrong = answer + offset;
    if (wrong !== answer && wrong >= 0) {
      options.add(wrong);
    }
  }

  return {
    num1,
    num2,
    operator,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
}

const ChameleonSVG = ({ mouthRef }: { mouthRef: RefObject<SVGCircleElement | null> }) => (
  <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl overflow-visible">
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#81C784" />
        <stop offset="50%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#2E7D32" />
      </linearGradient>
      <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#AED581" />
        <stop offset="100%" stopColor="#7CB342" />
      </linearGradient>
      <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="#C5E1A5" />
        <stop offset="80%" stopColor="#689F38" />
        <stop offset="100%" stopColor="#33691E" />
      </radialGradient>
      <linearGradient id="legGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#66BB6A" />
        <stop offset="100%" stopColor="#1B5E20" />
      </linearGradient>
    </defs>

    {/* Branch */}
    <path d="M -50 250 Q 150 270 450 220" stroke="#5D4037" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M 200 260 Q 250 230 300 240" stroke="#5D4037" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path d="M -50 255 Q 150 275 450 225" stroke="#3E2723" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.5" />

    {/* Leaves */}
    <path d="M 280 235 Q 310 200 340 220 Q 310 250 280 235" fill="#388E3C" />
    <path d="M 285 240 Q 310 215 330 225 Q 310 245 285 240" fill="#4CAF50" />
    <path d="M 50 255 Q 20 220 0 240 Q 30 270 50 255" fill="#388E3C" />
    <path d="M 150 265 Q 130 290 160 300 Q 180 280 150 265" fill="#388E3C" />

    {/* Chameleon Tail (Realistic Curl - Filled Path instead of Stroke) */}
    <path d="M 140 220 C 60 250 20 120 100 120 C 160 120 180 200 120 200 C 80 200 80 140 110 140 C 130 140 140 170 120 170" stroke="url(#bodyGrad)" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M 140 220 C 60 250 20 120 100 120 C 160 120 180 200 120 200 C 80 200 80 140 110 140 C 130 140 140 170 120 170" stroke="#2E7D32" strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.4" strokeDasharray="5 15" />

    {/* Back Legs */}
    <path d="M 155 205 L 125 255 L 110 255" stroke="url(#legGrad)" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 175 205 L 155 260 L 170 260" stroke="#388E3C" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Claws */}
    <path d="M 110 255 Q 105 260 100 265 M 115 255 Q 110 260 105 265 M 120 255 Q 115 260 115 265" stroke="#A1887F" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 170 260 Q 165 265 160 270 M 175 260 Q 170 265 165 270 M 180 260 Q 175 265 175 270" stroke="#A1887F" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Body */}
    <path d="M 130 220 C 100 150 160 110 220 130 C 270 145 285 200 240 235 C 190 260 150 255 130 220 Z" fill="url(#bodyGrad)" />

    {/* Belly accent */}
    <path d="M 135 215 C 160 245 190 250 230 230 C 240 225 240 205 220 200 C 190 195 150 185 135 215 Z" fill="url(#bellyGrad)" opacity="0.9" />

    {/* Body Patterns (Mottled spots & stripes) */}
    <g opacity="0.5" fill="#1B5E20">
      <circle cx="160" cy="150" r="5" />
      <circle cx="180" cy="140" r="6" />
      <circle cx="200" cy="135" r="4" />
      <circle cx="215" cy="145" r="7" />
      <circle cx="230" cy="160" r="5" />
      <circle cx="170" cy="170" r="8" />
      <circle cx="190" cy="165" r="9" />
      <circle cx="210" cy="175" r="6" />
      <circle cx="160" cy="190" r="5" />
      <circle cx="180" cy="195" r="7" />
    </g>
    <path d="M 160 135 Q 150 160 140 180 M 190 125 Q 180 160 170 190 M 220 135 Q 210 170 205 195 M 245 155 Q 240 185 230 205" stroke="#FFF59D" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4" />

    {/* Dorsal Crest (Textured Ridge) */}
    <path d="M 125 165 Q 130 150 140 140 Q 150 125 160 115 Q 175 102 190 108 Q 205 110 220 112 Q 235 115 245 125 Q 255 135 258 145" fill="none" stroke="#1B5E20" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 12" />
    <path d="M 125 165 Q 130 150 140 140 Q 150 125 160 115 Q 175 102 190 108 Q 205 110 220 112 Q 235 115 245 125 Q 255 135 258 145" fill="none" stroke="#FFF59D" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 12" opacity="0.9" />

    {/* Front Legs */}
    <path d="M 225 210 L 200 255 L 185 255" stroke="url(#legGrad)" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 245 210 L 230 260 L 245 260" stroke="#388E3C" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Claws */}
    <path d="M 185 255 Q 180 260 175 265 M 190 255 Q 185 260 180 265 M 195 255 Q 190 260 190 265" stroke="#A1887F" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 245 260 Q 240 265 235 270 M 250 260 Q 245 265 240 270 M 255 260 Q 250 265 250 270" stroke="#A1887F" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Head with Casque (Veiled Chameleon Crest) */}
    <path d="M 230 150 C 235 80 295 70 305 130 C 335 145 340 190 320 205 C 300 235 255 240 235 220 C 215 200 220 170 230 150 Z" fill="url(#bodyGrad)" />

    {/* Casque texture & ridges */}
    <path d="M 240 105 Q 275 80 295 120" stroke="#1B5E20" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M 255 85 Q 285 70 300 100" stroke="#FFF59D" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />

    {/* Head/Jaw Shading */}
    <path d="M 260 215 Q 295 230 320 205" stroke="#1B5E20" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />

    {/* Realistic Eye Turret (Cone) */}
    <ellipse cx="280" cy="155" rx="28" ry="28" fill="url(#eyeGrad)" stroke="#1B5E20" strokeWidth="2" />
    <ellipse cx="282" cy="155" rx="20" ry="20" fill="#AED581" stroke="#33691E" strokeWidth="1" />
    {/* Turret wrinkles */}
    <path d="M 258 155 A 22 22 0 0 1 302 155" stroke="#4CAF50" strokeWidth="2" fill="none" />
    <path d="M 259 165 A 23 23 0 0 1 304 165" stroke="#4CAF50" strokeWidth="2" fill="none" />

    {/* Eyeball & Pupil */}
    <circle cx="286" cy="155" r="9" fill="#E8F5E9" />
    <circle cx="288" cy="155" r="4" fill="#000000" />
    <circle cx="289" cy="154" r="1.5" fill="white" /> {/* Catchlight */}

    {/* Mouth */}
    <path d="M 255 210 Q 295 225 330 195" stroke="#1B5E20" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 325 200 Q 330 195 330 190" stroke="#1B5E20" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Mouth Reference Point for Tongue */}
    <circle ref={mouthRef} cx="330" cy="195" r="1" fill="transparent" />
  </svg>
);

const Bug = ({ number, onClick, hidden }: { number: number, onClick: (e: any) => void, hidden: boolean }) => {
  const [rot] = useState(() => Math.random() * 40 - 20);

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, rotate: rot }}
      animate={{ scale: hidden ? 0 : 1, rotate: hidden ? rot + 180 : rot }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-[#FF9800] rounded-full shadow-[0_6px_0_#F57C00] border-4 border-[#E65100] cursor-pointer z-10"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Bug Details - Static */}
      <div className="absolute top-1 w-2 h-4 bg-[#E65100] rounded-full" />
      <div className="absolute top-2 left-2 w-2 h-2 bg-[#333] rounded-full" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-[#333] rounded-full" />
      <div className="absolute w-full h-1 bg-[#E65100]/30 top-1/2" />

      <span className="text-3xl md:text-5xl font-black text-white z-10 drop-shadow-md pointer-events-none">{number}</span>
    </motion.button>
  );
}

const levels = [
  { id: 1, text: 'Niveau 1 : Addition jusqu\'à 10' },
  { id: 2, text: 'Niveau 2 : Soustraction jusqu\'à 10' },
  { id: 3, text: 'Niveau 3 : Addition et Soustraction jusqu\'à 10' },
  { id: 4, text: 'Niveau 4 : Addition jusqu\'à 20' },
  { id: 5, text: 'Niveau 5 : Soustraction jusqu\'à 20' },
  { id: 6, text: 'Niveau 6 : Addition et Soustraction jusqu\'à 20' },
  { id: 7, text: 'Niveau 7 : Addition jusqu\'à 50' },
  { id: 8, text: 'Niveau 8 : Soustraction jusqu\'à 50' },
  { id: 9, text: 'Niveau 9 : Addition et Soustraction jusqu\'à 50' },
  { id: 10, text: 'Niveau 10 : Addition jusqu\'à 100' },
  { id: 11, text: 'Niveau 11 : Soustraction jusqu\'à 100' },
  { id: 12, text: 'Niveau 12 : Addition et Soustraction jusqu\'à 100' },
];

const getLevelColor = (level: number) => {
  if (level <= 3) return 'bg-[#4CAF50] hover:bg-[#43A047] shadow-[0_4px_0_#2E7D32] active:shadow-[0_0px_0_#2E7D32]';
  if (level <= 6) return 'bg-[#FF9800] hover:bg-[#F57C00] shadow-[0_4px_0_#E65100] active:shadow-[0_0px_0_#E65100]';
  if (level <= 9) return 'bg-[#F44336] hover:bg-[#E53935] shadow-[0_4px_0_#C62828] active:shadow-[0_0px_0_#C62828]';
  return 'bg-[#9C27B0] hover:bg-[#8E24AA] shadow-[0_4px_0_#6A1B9A] active:shadow-[0_0px_0_#6A1B9A]';
}

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [level, setLevel] = useState<number>(1);
  const [testCount, setTestCount] = useState<number>(0);
  const [correctFirstTry, setCorrectFirstTry] = useState<number>(0);
  const [mistakeMade, setMistakeMade] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [highestLevel, setHighestLevel] = useState<number>(() => {
    const saved = localStorage.getItem('chameleonHighestLevel');
    return saved ? parseInt(saved, 10) : 1; // Start at 1
  });

  const mouthRef = useRef<SVGCircleElement>(null);
  const [mouthPos, setMouthPos] = useState({ x: -100, y: -100 });
  const [tongueTarget, setTongueTarget] = useState<{ x: number, y: number } | null>(null);
  const [swallowedOption, setSwallowedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const updateMouthPos = () => {
    if (mouthRef.current && gameState === 'playing') {
      const rect = mouthRef.current.getBoundingClientRect();
      setMouthPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateMouthPos, 100);
    window.addEventListener('resize', updateMouthPos);
    window.addEventListener('scroll', updateMouthPos);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateMouthPos);
      window.removeEventListener('scroll', updateMouthPos);
    };
  }, [gameState]);

  const startGame = (selectedLevel: number) => {
    setLevel(selectedLevel);
    setTestCount(0);
    setCorrectFirstTry(0);
    setMistakeMade(false);
    setProblem(generateProblem(selectedLevel));
    setGameState('playing');
  };

  const handleOptionClick = (e: MouseEvent<HTMLButtonElement> | any, option: number) => {
    if (isAnimating || !problem) return;

    if (option === problem.answer) {
      if (!mistakeMade) {
        setCorrectFirstTry(prev => prev + 1);
      }
      setMistakeMade(false);
      setIsAnimating(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      setTongueTarget({ x: targetX, y: targetY });

      setTimeout(() => {
        setTongueTarget(null);
        setSwallowedOption(option);

        setTimeout(() => {
          if (testCount + 1 >= 10) {
            setGameState('finished');
          } else {
            setTestCount(prev => prev + 1);
            setProblem(generateProblem(level));
          }
          setSwallowedOption(null);
          setIsAnimating(false);
        }, 300);
      }, 200);
    } else {
      setMistakeMade(true);
      // Optional: Add visual feedback for wrong answer
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-[#B3E5FC] flex flex-col items-center justify-center font-sans p-4 relative z-50">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleFullscreen}
            className="bg-white/80 p-2 rounded-xl font-bold text-gray-700 shadow-sm border-2 border-white hover:bg-white cursor-pointer relative z-50 flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl text-center max-w-5xl w-full border-4 border-[#4CAF50]">
          <h1 className="text-4xl md:text-5xl font-black text-[#333] mb-4">Jeu de Calcul Caméléon</h1>
          {highestLevel > 0 && (
            <div className="mb-4 inline-block bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-bold">
              Dernier niveau réussi : {highestLevel}
            </div>
          )}
          <p className="text-xl text-gray-600 mb-8">Choisis un niveau pour commencer !</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map(l => {
              const isLocked = l.id > highestLevel;
              return (
                <button
                  key={l.id}
                  onClick={() => !isLocked && startGame(l.id)}
                  disabled={isLocked}
                  className={`py-3 px-4 text-white text-lg font-bold rounded-xl transition-all relative z-50 ${isLocked ? 'bg-gray-400 cursor-not-allowed opacity-60 shadow-none' : getLevelColor(l.id) + ' cursor-pointer'}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {l.text} {isLocked && '🔒'}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const passed = correctFirstTry >= 7;
    const isNewUnlock = passed && level === highestLevel;

    if (isNewUnlock) {
      const newHighest = level + 1;
      setHighestLevel(newHighest);
      localStorage.setItem('chameleonHighestLevel', newHighest.toString());
    }

    return (
      <div className="min-h-screen bg-[#B3E5FC] flex flex-col items-center justify-center font-sans p-4 relative z-50">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleFullscreen}
            className="bg-white/80 p-2 rounded-xl font-bold text-gray-700 shadow-sm border-2 border-white hover:bg-white cursor-pointer relative z-50 flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border-4 border-[#FFEB3B]"
        >
          <h1 className="text-4xl md:text-6xl font-black text-[#FF9800] mb-4 drop-shadow-md">
            {passed ? 'BRAVO !' : 'DOMMAGE !'}
          </h1>
          <p className="text-xl text-gray-700 mb-2 font-bold">
            Score : {correctFirstTry} / 10
          </p>
          <p className="text-lg text-gray-600 mb-8">
            {passed
              ? `Tu as réussi le niveau ${level} ! Le niveau suivant est débloqué.`
              : `Il te faut au moins 7 bonnes réponses du premier coup pentru a trece mai departe.`}
          </p>

          <button onClick={() => setGameState('menu')} className="py-4 px-8 bg-[#4CAF50] hover:bg-[#43A047] text-white text-2xl font-bold rounded-xl shadow-[0_6px_0_#2E7D32] active:translate-y-1 active:shadow-[0_2px_0_#2E7D32] transition-all cursor-pointer relative z-50">
            {passed ? 'Continuer' : 'Réessayer'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#B3E5FC] relative overflow-hidden flex flex-col font-sans selection:bg-transparent">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFF176] rounded-full shadow-[0_0_60px_rgba(255,241,118,0.8)]" />
      <div className="absolute top-20 left-20 w-48 h-16 bg-white/80 rounded-full blur-sm" />
      <div className="absolute top-40 right-1/3 w-64 h-20 bg-white/60 rounded-full blur-sm" />

      {/* Header Info */}
      <div className="absolute top-4 left-4 z-50">
        <button onClick={() => setGameState('menu')} className="bg-white/80 px-4 py-2 rounded-xl font-bold text-gray-700 shadow-sm border-2 border-white hover:bg-white cursor-pointer relative z-50">
          Menu
        </button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleFullscreen}
          className="bg-white/80 p-2 rounded-xl font-bold text-gray-700 shadow-sm border-2 border-white hover:bg-white cursor-pointer relative z-50 flex items-center justify-center"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>

      {/* Stars Progress */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 md:gap-2 bg-white/60 p-2 rounded-full border-2 border-white shadow-sm">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ scale: i < testCount ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Star
              className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 ${i < testCount
                ? 'fill-yellow-400 text-yellow-500 drop-shadow-sm'
                : 'fill-gray-200 text-gray-300'
                }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Math Problem - Top Center */}
      <div className="w-full pt-20 md:pt-24 flex justify-center z-20">
        {problem && (
          <div className="bg-white px-8 py-4 md:px-12 md:py-6 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.1)] border-4 border-[#4CAF50]">
            <h1 className="text-5xl md:text-7xl font-black text-[#333] tracking-wider">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </h1>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative w-full max-w-6xl mx-auto flex flex-col md:flex-row">

        {/* Chameleon Area */}
        <div className="flex-1 relative min-h-[250px] md:min-h-0">
          <div className="absolute bottom-0 left-0 md:bottom-10 md:left-10 w-64 h-64 md:w-96 md:h-96 z-20 pointer-events-none">
            <ChameleonSVG mouthRef={mouthRef} />
          </div>
        </div>

        {/* Bugs Area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-10 z-20">
          <div className="grid grid-cols-2 gap-8 md:gap-16 w-full max-w-md">
            {problem?.options.map((opt, i) => (
              <div key={`${problem.num1}-${problem.num2}-${opt}-${i}`} className="flex justify-center">
                <Bug
                  number={opt}
                  onClick={(e) => handleOptionClick(e, opt)}
                  hidden={swallowedOption === opt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tongue Overlay */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
        {mouthPos.x > 0 && (
          <motion.line
            x1={mouthPos.x}
            y1={mouthPos.y}
            animate={{
              x2: tongueTarget ? tongueTarget.x : mouthPos.x,
              y2: tongueTarget ? tongueTarget.y : mouthPos.y,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            stroke="#FF5252"
            strokeWidth="20"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
