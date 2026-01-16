import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles } from 'lucide-react';

interface LanguageDisplayProps {
  language: string | null;
  code: string | null;
  confidence: number | null;
  isDetecting?: boolean;
}

const LanguageDisplay = ({ language, code, confidence, isDetecting }: LanguageDisplayProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Globe className="w-4 h-4" />
        <span>Detected Language</span>
      </div>
      
      <AnimatePresence mode="wait">
        {isDetecting ? (
          <motion.div
            key="detecting"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3"
          >
            <div className="language-badge">
              <div className="w-4 h-4 rounded-full bg-primary/30 animate-pulse" />
              <span className="text-muted-foreground">Detecting...</span>
            </div>
          </motion.div>
        ) : language && code ? (
          <motion.div
            key="detected"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="language-badge">
                <Sparkles className="w-4 h-4" />
                <span>{language}</span>
                <span className="text-muted-foreground">({code})</span>
              </div>
            </div>
            
            {confidence !== null && confidence > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-primary">{confidence}%</span>
                </div>
                <div className="confidence-bar">
                  <motion.div
                    className="confidence-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm"
          >
            Start typing or speaking to detect language...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageDisplay;
