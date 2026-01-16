import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import SpeakButton from './SpeakButton';
import CopyButton from './CopyButton';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface TranslationOutputProps {
  translatedText: string;
  targetLanguage: string;
  isTranslating: boolean;
  error: string | null;
}

const TranslationOutput = ({ translatedText, targetLanguage, isTranslating, error }: TranslationOutputProps) => {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  const handleSpeak = () => {
    speak(translatedText, targetLanguage);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Translation</span>
        <div className="flex items-center gap-2">
          <CopyButton text={translatedText} disabled={!translatedText || isTranslating} />
          <SpeakButton
            isSpeaking={isSpeaking}
            isSupported={isSupported}
            disabled={!translatedText || isTranslating}
            onSpeak={handleSpeak}
            onStop={stop}
          />
        </div>
      </div>

      <div className="relative min-h-[120px] rounded-xl bg-input border border-border p-4">
        {isTranslating ? (
          <div className="flex items-center justify-center h-full min-h-[80px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Translating...</span>
            </motion.div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm"
          >
            {error}
          </motion.div>
        ) : translatedText ? (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-card-foreground leading-relaxed whitespace-pre-wrap"
          >
            {translatedText}
          </motion.p>
        ) : (
          <span className="text-muted-foreground">
            Translation will appear here...
          </span>
        )}
      </div>
    </div>
  );
};

export default TranslationOutput;
