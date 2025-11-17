import { useEffect } from 'react';
import '../App.css';

interface CelebrationToastProps {
  show: boolean;
  onClose: () => void;
}

export const CelebrationToast = ({ show, onClose }: CelebrationToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Show for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="celebration-toast" data-testid="celebration-toast">
      <div className="celebration-toast__content">
        <span className="celebration-toast__icon">🎉</span>
        <span className="celebration-toast__text">Hooray! Task completed!</span>
      </div>
    </div>
  );
};

