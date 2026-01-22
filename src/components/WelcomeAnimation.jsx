import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WelcomeAnimation = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);

  // Animation steps
  useEffect(() => {
    const steps = [
      { delay: 1000, text: "WELCOME" },
      { delay: 1500, text: "SAQIB" },
      { delay: 1500, text: "TO" },
      { delay: 1500, text: "MANAGEMENT" },
      { delay: 1500, text: "PORTAL" },
      { delay: 2000, text: "🔐" } // Final icon
    ];

    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, steps[step].delay);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setTimeout(() => onComplete(), 500); // Callback after fade out
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const stepsTexts = [
    "WELCOME",
    "SAQIB",
    "TO",
    "MANAGEMENT",
    "PORTAL",
    "🔐"
  ];

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black"
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[2px] h-[2px] bg-white rounded-full"
                initial={{
                  x: Math.random() * 100 + 'vw',
                  y: Math.random() * 100 + 'vh',
                  opacity: 0.3
                }}
                animate={{
                  x: Math.random() * 100 + 'vw',
                  y: Math.random() * 100 + 'vh',
                  opacity: [0.1, 0.8, 0.1]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.05
                }}
              />
            ))}
          </div>

          {/* Main Animation Container */}
          <div className="relative z-10 text-center">
            {/* Glowing Orb Effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 70%)'
              }}
            />

            {/* Current Text Display */}
            {step > 0 && step <= stepsTexts.length && (
              <motion.div
                key={step}
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-8"
              >
                <motion.h1
                  className="text-6xl md:text-8xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #00ffff 0%, #0080ff 50%, #8000ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {stepsTexts[step - 1]}
                </motion.h1>
              </motion.div>
            )}

            {/* Progress Indicator */}
            <div className="mt-12">
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / stepsTexts.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Loading Dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      scale: step % 3 === i ? [1, 1.5, 1] : 1,
                      opacity: step % 3 === i ? [0.5, 1, 0.5] : 0.3
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Subtle Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="mt-8 text-gray-400 text-sm font-medium tracking-wider uppercase"
            >
              Loading Management Systems
            </motion.p>
          </div>

          {/* Bottom Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 text-gray-500 text-xs"
          >
            © 2024 Management Portal v2.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
