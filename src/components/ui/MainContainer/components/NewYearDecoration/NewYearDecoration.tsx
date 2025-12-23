'use client';

import { useEffect, useState } from 'react';

export default function NewYearDecoration() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
  const [ornaments, setOrnaments] = useState<Array<{ id: number; left: number; swing: boolean }>>([]);

  useEffect(() => {
    // Generate snowflakes
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10
    }));
    setSnowflakes(flakes);

    // Generate ornaments for garland
    const orns = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: (i * 8) + 4,
      swing: false
    }));
    setOrnaments(orns);
  }, []);

  const handleOrnamentHover = (id: number) => {
    setOrnaments(prev => prev.map(orn =>
      orn.id === id ? { ...orn, swing: true } : orn
    ));

    // Play sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKnn77NnHQc6j9n0yHMkBSp+zPLaizsIGGS46+miUhEMT6bn8bllHgY7lNr0xnElBSl+zPLaizsIGGS46+miUhEMT6bn8bllHgY7lNr0xnElBSl+zPLaizsIGGS46+miUhEMT6bn8bllHgY7lNr0xnElBSl+zPLaizsIGGS46+mjUhEMT6bn8bllHgY7lNr0xnElBQ==');
    audio.volume = 0.3;
    audio.play().catch(() => {});

    setTimeout(() => {
      setOrnaments(prev => prev.map(orn =>
        orn.id === id ? { ...orn, swing: false } : orn
      ));
    }, 600);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Snowfall */}
      <div className="absolute inset-0 overflow-hidden">
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="absolute text-white opacity-80"
            style={{
              left: `${flake.left}%`,
              top: '-10px',
              fontSize: `${8 + Math.random() * 8}px`,
              animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Top Garland */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-auto">
        {/* Garland background */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-green-700/40 via-green-600/30 to-transparent">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(90deg, #2d5016 0px, #3d6b1f 20px, #2d5016 40px)`,
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
            }}></div>
          </div>
        </div>

        {/* Pine needles effect */}
        <svg className="absolute top-0 left-0 right-0 h-16" preserveAspectRatio="none" viewBox="0 0 1200 100">
          <defs>
            <pattern id="pinePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20,5 L25,15 L15,15 Z M18,12 L23,20 L13,20 Z M22,12 L27,20 L17,20 Z"
                    fill="#2d5016" opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="1200" height="100" fill="url(#pinePattern)"/>
          <ellipse cx="600" cy="0" rx="600" ry="50" fill="url(#pinePattern)" opacity="0.8"/>
        </svg>

        {/* Christmas ornaments */}
        {ornaments.map(orn => (
          <div
            key={orn.id}
            className="absolute top-8 cursor-pointer transition-transform"
            style={{
              left: `${orn.left}%`,
              transform: orn.swing ? 'rotate(15deg) scale(1.1)' : 'rotate(0deg) scale(1)',
              transition: 'transform 0.3s ease-out'
            }}
            onMouseEnter={() => handleOrnamentHover(orn.id)}
          >
            {/* String */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-4 bg-yellow-700/60"></div>

            {/* Ornament ball */}
            <div className="relative">
              <div className={`w-8 h-8 rounded-full ${
                orn.id % 3 === 0 ? 'bg-gradient-to-br from-red-400 to-red-600' :
                  orn.id % 3 === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'
              } shadow-lg`}>
                {/* Shine effect */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full"></div>

                {/* Cap */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-t"></div>
              </div>

              {/* Sparkle animation */}
              {orn.swing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-yellow-300 text-xl animate-ping">✨</div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Lights effect */}
        <div className="absolute top-0 left-0 right-0 h-full flex justify-around items-start pt-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full animate-pulse"
              style={{
                backgroundColor: i % 4 === 0 ? '#fef08a' : i % 4 === 1 ? '#fca5a5' : i % 4 === 2 ? '#93c5fd' : '#86efac',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s',
                boxShadow: `0 0 10px currentColor`
              }}
            ></div>
          ))}
        </div>

        {/* Gold ribbon bow */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="relative w-12 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full transform rotate-45"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full transform -rotate-45"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          50% {
            transform: translateY(50vh) translateX(100px);
          }
          100% {
            transform: translateY(100vh) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}