import { motion } from 'framer-motion';
import React from 'react';

export const microInteractions = {
  buttonPress: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.02 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },

  cardHover: {
    whileHover: { 
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },

  successPulse: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },

  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },

  numberCount: (target: number, duration: number = 1) => ({
    initial: 0,
    animate: target,
    transition: { duration, ease: 'easeOut' }
  }),

  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear' as const
    }
  },

  confetti: {
    initial: { y: -100, opacity: 1, rotate: 0 },
    animate: { 
      y: 500, 
      opacity: 0, 
      rotate: 720,
      transition: { duration: 2, ease: 'easeOut' }
    }
  },

  ripple: {
    initial: { scale: 0, opacity: 1 },
    animate: { scale: 4, opacity: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  shake: {
    animate: { 
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },

  glow: {
    animate: {
      boxShadow: [
        '0 0 5px rgba(59, 130, 246, 0.5)',
        '0 0 20px rgba(59, 130, 246, 0.8)',
        '0 0 5px rgba(59, 130, 246, 0.5)'
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  },

  progressFill: (progress: number) => ({
    initial: { width: '0%' },
    animate: { width: `${progress}%` },
    transition: { duration: 1, ease: 'easeOut' }
  }),

  bounce: {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 }
    }
  },

  rotate: {
    animate: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: 'linear' }
    }
  },

  scalePulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, repeat: Infinity }
    }
  }
};

export const AnimatedButton: React.FC<any> = ({ children, ...props }) => (
  <motion.button
    {...microInteractions.buttonPress}
    {...props}
  >
    {children}
  </motion.button>
);

export const AnimatedCard: React.FC<any> = ({ children, ...props }) => (
  <motion.div
    {...microInteractions.cardHover}
    {...props}
  >
    {children}
  </motion.div>
);

export const SuccessAnimation: React.FC<{ show: boolean }> = ({ show }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className="bg-white rounded-full p-8"
    >
      <motion.svg
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-24 h-24 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  </motion.div>
);

export const LoadingSpinner: React.FC = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
  />
);

export const ShimmerLoader: React.FC<{ width?: string; height?: string }> = ({ 
  width = '100%', 
  height = '20px' 
}) => (
  <motion.div
    className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
    style={{ width, height, backgroundSize: '200% 100%' }}
    {...microInteractions.shimmer}
  />
);

export const NumberCounter: React.FC<{ value: number; duration?: number }> = ({ 
  value, 
  duration = 1 
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export const ConfettiPiece: React.FC<{ delay: number; color: string }> = ({ delay, color }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ backgroundColor: color, left: `${Math.random() * 100}%` }}
    initial={{ y: -100, opacity: 1, rotate: 0 }}
    animate={{ 
      y: 500, 
      opacity: 0, 
      rotate: 720,
    }}
    transition={{ duration: 2, delay, ease: 'easeOut' }}
  />
);

export const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiPiece 
          key={i} 
          delay={Math.random() * 0.5} 
          color={colors[Math.floor(Math.random() * colors.length)]} 
        />
      ))}
    </div>
  );
};

export const RippleButton: React.FC<any> = ({ children, onClick, ...props }) => {
  const [ripples, setRipples] = React.useState<any[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    
    setRipples([...ripples, newRipple]);
    
    setTimeout(() => {
      setRipples(ripples.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick?.(e);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative overflow-hidden"
      {...props}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </motion.button>
  );
};

export default microInteractions;
