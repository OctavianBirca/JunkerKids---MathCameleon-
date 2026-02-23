import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

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

const ChameleonSVG = ({ mouthRef }: { mouthRef: React.RefObject<SVGCircleElement | null> }) => (
  <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl overflow-visible">
    {/* Branch */}
    <path d="M -50 250 Q 150 270 450 220" stroke="#5D4037" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M 200 260 Q 250 230 300 240" stroke="#5D4037" strokeWidth="12" fill="none" strokeLinecap="round" />
    
    {/* Leaves */}
    <path d="M 280 235 Q 310 200 340 220 Q 310 250 280 235" fill="#4CAF50" />
    <path d="M 50 255 Q 20 220 0 240 Q 30 270 50 255" fill="#4CAF50" />
    <path d="M 150 265 Q 130 290 160 300 Q 180 280 150 265" fill="#4CAF50" />

    {/* Chameleon Tail (curled) */}
    <path d="M 140 220 C 60 250 40 130 100 130 C 150 130 160 190 120 190 C 90 190 90 150 110 150" stroke="#8BC34A" strokeWidth="24" fill="none" strokeLinecap="round" />
    <path d="M 140 220 C 60 250 40 130 100 130 C 150 130 160 190 120 190 C 90 190 90 150 110 150" stroke="#689F38" strokeWidth="24" fill="none" strokeLinecap="round" strokeDasharray="4 12" />

    {/* Back Legs */}
    <path d="M 150 210 L 130 255 L 115 255" stroke="#7CB342" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 170 210 L 160 260 L 175 260" stroke="#558B2F" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Body */}
    <path d="M 130 220 C 110 160 160 130 220 140 C 270 150 280 200 240 230 C 200 250 150 240 130 220 Z" fill="#8BC34A" />
    {/* Body Pattern */}
    <path d="M 150 160 Q 180 140 210 155" stroke="#AED581" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M 145 180 Q 190 160 230 180" stroke="#AED581" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M 155 200 Q 190 190 225 205" stroke="#AED581" strokeWidth="6" fill="none" strokeLinecap="round" />
    
    {/* Spikes on back */}
    <path d="M 135 175 L 130 165 L 145 168 L 145 155 L 160 160 L 165 145 L 180 152 L 190 138 L 205 145 L 220 135 L 230 145 L 245 140 L 250 155 L 265 155" stroke="#558B2F" strokeWidth="4" fill="none" strokeLinejoin="round" />

    {/* Front Legs */}
    <path d="M 220 210 L 200 255 L 185 255" stroke="#7CB342" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 240 210 L 235 260 L 250 260" stroke="#558B2F" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Head */}
    <path d="M 230 160 C 250 130 300 130 320 160 C 340 190 320 230 260 230 C 230 230 220 190 230 160 Z" fill="#8BC34A" />
    
    {/* Eye Cone */}
    <ellipse cx="280" cy="165" rx="22" ry="22" fill="#7CB342" />
    <ellipse cx="282" cy="165" rx="16" ry="16" fill="#9CCC65" />
    
    {/* Eye */}
    <circle cx="284" cy="165" r="8" fill="white" />
    <circle cx="286" cy="165" r="4" fill="#212121" />

    {/* Mouth */}
    <path d="M 260 210 Q 290 220 320 200" stroke="#33691E" strokeWidth="4" fill="none" strokeLinecap="round" />

    {/* Mouth Reference Point (Invisible) */}
    <circle ref={mouthRef} cx="320" cy="200" r="1" fill="transparent" />
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
  const [problem, setProblem] = useState<Problem | null>(null);
  const [highestLevel, setHighestLevel] = useState<number>(() => {
    const saved = localStorage.getItem('chameleonHighestLevel');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const mouthRef = useRef<SVGCircleElement>(null);
  const [mouthPos, setMouthPos] = useState({ x: -100, y: -100 });
  const [tongueTarget, setTongueTarget] = useState<{x: number, y: number} | null>(null);
  const [swallowedOption, setSwallowedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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
    setProblem(generateProblem(selectedLevel));
    setGameState('playing');
  };

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>, option: number) => {
    if (isAnimating || !problem) return;
    
    if (option === problem.answer) {
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
            if (level > highestLevel) {
              setHighestLevel(level);
              localStorage.setItem('chameleonHighestLevel', level.toString());
            }
          } else {
            setTestCount(prev => prev + 1);
            setProblem(generateProblem(level));
          }
          setSwallowedOption(null);
          setIsAnimating(false);
        }, 300);
      }, 200);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-[#81D4FA] flex flex-col items-center justify-center font-sans p-4 relative z-50">
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl text-center max-w-5xl w-full border-4 border-[#4CAF50]">
          <h1 className="text-4xl md:text-5xl font-black text-[#333] mb-4">Jeu de Calcul Caméléon</h1>
          {highestLevel > 0 && (
            <div className="mb-4 inline-block bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-bold">
              Dernier niveau réussi : {highestLevel}
            </div>
          )}
          <p className="text-xl text-gray-600 mb-8">Choisis un niveau pour commencer !</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map(l => (
              <button 
                key={l.id} 
                onClick={() => startGame(l.id)} 
                className={`py-3 px-4 text-white text-lg font-bold rounded-xl transition-all cursor-pointer relative z-50 ${getLevelColor(l.id)}`}
                style={{ touchAction: 'manipulation' }}
              >
                {l.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-[#81D4FA] flex flex-col items-center justify-center font-sans p-4 relative z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border-4 border-[#FFEB3B]"
        >
          <h1 className="text-6xl md:text-8xl font-black text-[#FF9800] mb-4 drop-shadow-md">BRAVO !</h1>
          <p className="text-2xl text-gray-700 mb-8 font-bold">Tu as terminé le niveau {level} avec succès !</p>
          
          <button onClick={() => setGameState('menu')} className="py-4 px-8 bg-[#4CAF50] hover:bg-[#43A047] text-white text-2xl font-bold rounded-xl shadow-[0_6px_0_#2E7D32] active:translate-y-1 active:shadow-[0_2px_0_#2E7D32] transition-all cursor-pointer relative z-50">
            Menu Principal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#81D4FA] relative overflow-hidden flex flex-col font-sans selection:bg-transparent">
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
              className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 ${
                i < testCount 
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
