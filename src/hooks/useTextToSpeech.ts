import { useState, useCallback, useEffect, useRef } from 'react';

interface TextToSpeechHook {
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  getVoiceForLanguage: (langCode: string) => SpeechSynthesisVoice | null;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const getVoiceForLanguage = useCallback((langCode: string): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;

    // Normalize language code (e.g., 'en' -> 'en-US', 'es' -> 'es-ES')
    const normalizedCode = langCode.toLowerCase();
    
    // Try exact match first
    let voice = voices.find(v => v.lang.toLowerCase() === normalizedCode);
    
    // Try partial match (e.g., 'en' matches 'en-US')
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().startsWith(normalizedCode));
    }
    
    // Try matching by language name
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().includes(normalizedCode));
    }

    return voice || null;
  }, [voices]);

  const speak = useCallback((text: string, lang: string = 'en') => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language and voice
    utterance.lang = lang;
    const voice = getVoiceForLanguage(lang);
    if (voice) {
      utterance.voice = voice;
    }

    // Configure speech parameters
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, getVoiceForLanguage]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    getVoiceForLanguage,
  };
};
