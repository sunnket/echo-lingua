import { motion } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

const VoiceInputButton = ({ isListening, isSupported, onStart, onStop }: VoiceInputButtonProps) => {
  if (!isSupported) {
    return (
      <button
        disabled
        className="icon-button opacity-50 cursor-not-allowed"
        title="Speech recognition not supported"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={isListening ? onStop : onStart}
      className={`icon-button ${isListening ? 'recording-pulse bg-destructive/20 text-destructive border-destructive/30' : ''}`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <Square className="w-5 h-5 fill-current" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default VoiceInputButton;
