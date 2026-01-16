import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Sparkles, RefreshCw } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import SpeakButton from './SpeakButton';
import LanguageDisplay from './LanguageDisplay';
import LanguageSelector from './LanguageSelector';
import TranslationOutput from './TranslationOutput';
import CopyButton from './CopyButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useLanguageDetection } from '@/hooks/useLanguageDetection';
import { useTranslation } from '@/hooks/useTranslation';

const TranslatorCard = () => {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [debouncedText, setDebouncedText] = useState('');

  // Hooks
  const { isListening, transcript, startListening, stopListening, isSupported: sttSupported, error: sttError } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { detectLanguage, detectedLanguage, isDetecting } = useLanguageDetection();
  const { translate, translatedText, isTranslating, error: translationError } = useTranslation();

  // Update input text when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Debounce text input for language detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(inputText);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Detect language when text changes
  useEffect(() => {
    if (debouncedText.trim().length >= 3) {
      detectLanguage(debouncedText);
    }
  }, [debouncedText, detectLanguage]);

  // Auto-translate when language is detected and text is ready
  useEffect(() => {
    if (detectedLanguage && debouncedText.trim().length >= 3) {
      translate(debouncedText, detectedLanguage.code, targetLanguage);
    }
  }, [detectedLanguage, debouncedText, targetLanguage, translate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleClear = () => {
    setInputText('');
    stopSpeaking();
  };

  const handleSpeakOriginal = () => {
    if (inputText && detectedLanguage) {
      speak(inputText, detectedLanguage.code);
    }
  };

  const swapLanguages = useCallback(() => {
    if (translatedText && detectedLanguage) {
      setInputText(translatedText);
      setTargetLanguage(detectedLanguage.code);
    }
  }, [translatedText, detectedLanguage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-card-foreground">
                Universal Translator
              </h2>
              <p className="text-sm text-muted-foreground">
                Speak or type in any language
              </p>
            </div>
          </div>
          
          {inputText && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              Clear
            </motion.button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Input</span>
              <div className="flex items-center gap-2">
                <CopyButton text={inputText} disabled={!inputText} />
                <SpeakButton
                  isSpeaking={isSpeaking && !translatedText}
                  isSupported={ttsSupported}
                  disabled={!inputText || !detectedLanguage}
                  onSpeak={handleSpeakOriginal}
                  onStop={stopSpeaking}
                />
                <VoiceInputButton
                  isListening={isListening}
                  isSupported={sttSupported}
                  onStart={startListening}
                  onStop={stopListening}
                />
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type something or click the microphone to speak..."
                className="premium-input min-h-[120px] resize-none"
                rows={4}
              />
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-3 right-3 flex items-center gap-2 text-destructive text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  Recording...
                </motion.div>
              )}
            </div>

            {sttError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {sttError}
              </motion.p>
            )}
          </div>

          {/* Language Detection Display */}
          <LanguageDisplay
            language={detectedLanguage?.language || null}
            code={detectedLanguage?.code || null}
            confidence={detectedLanguage?.confidence || null}
            isDetecting={isDetecting}
          />

          {/* Divider with Swap Button */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={swapLanguages}
              disabled={!translatedText || !detectedLanguage}
              className="relative z-10 p-2 rounded-full bg-muted border border-border hover:border-primary/50 hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Swap languages"
            >
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Target Language Selector */}
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            label="Translate to"
          />

          {/* Translation Output */}
          <TranslationOutput
            translatedText={translatedText}
            targetLanguage={targetLanguage}
            isTranslating={isTranslating}
            error={translationError}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TranslatorCard;
