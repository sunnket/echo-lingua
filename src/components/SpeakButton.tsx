import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface SpeakButtonProps {
  isSpeaking: boolean;
  isSupported: boolean;
  disabled?: boolean;
  onSpeak: () => void;
  onStop: () => void;
}

const SpeakButton = ({ isSpeaking, isSupported, disabled, onSpeak, onStop }: SpeakButtonProps) => {
  if (!isSupported) {
    return (
      <button
        disabled
        className="icon-button opacity-50 cursor-not-allowed"
        title="Text-to-speech not supported"
      >
        <VolumeX className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={isSpeaking ? onStop : onSpeak}
      disabled={disabled}
      className={`icon-button ${isSpeaking ? 'bg-primary/20 text-primary border-primary/30' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isSpeaking ? 'Stop speaking' : 'Listen'}
    >
      {isSpeaking ? (
        <div className="sound-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default SpeakButton;
