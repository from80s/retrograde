import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RetroGradeVideo from '../../assets/videos/RetroGrade_intro.mp4';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      setTimeout(() => setVisible(false), 5000);
    });

    const handleEnded = () => {
      setVisible(false);
    };

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5500);

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setTimeout(onFinish, 500);
    }
  }, [visible, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={RetroGradeVideo}
            className="max-w-full max-h-full object-contain"
            playsInline
            muted={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
