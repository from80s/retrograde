import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import RetroGradeVideo from '../../../assets/videos/RetroGrade_intro.mp4';
import { Overlay, Video } from './styles';

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
      setTimeout(() => setVisible(false), 7000);
    });

    const handleEnded = () => {
      setVisible(false);
    };

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 7500);

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
        <Overlay
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Video
            ref={videoRef}
            src={RetroGradeVideo}
            playsInline
            muted={false}
          />
        </Overlay>
      )}
    </AnimatePresence>
  );
}
