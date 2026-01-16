import { useState, useCallback } from 'react';

interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslationHook {
  translate: (text: string, sourceLang: string, targetLang: string) => Promise<TranslationResult | null>;
  translatedText: string;
  isTranslating: boolean;
  error: string | null;
}

// MyMemory Translation API (Free tier: 1000 words/day)
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export const useTranslation = (): TranslationHook => {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult | null> => {
    if (!text.trim()) {
      setTranslatedText('');
      return null;
    }

    if (sourceLang === targetLang) {
      setTranslatedText(text);
      return {
        translatedText: text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      };
    }

    setIsTranslating(true);
    setError(null);

    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const url = new URL(MYMEMORY_API);
      url.searchParams.append('q', text);
      url.searchParams.append('langpair', langPair);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseStatus !== 200) {
        // Check for specific error messages
        if (data.responseDetails?.includes('INVALID LANGUAGE PAIR')) {
          throw new Error(`Translation not available for ${sourceLang} → ${targetLang}`);
        }
        throw new Error(data.responseDetails || 'Translation failed');
      }

      const translated = data.responseData.translatedText;
      
      // Handle MyMemory's warning messages
      if (translated.includes('MYMEMORY WARNING')) {
        throw new Error('Translation limit reached. Please try again later.');
      }

      setTranslatedText(translated);
      setIsTranslating(false);

      return {
        translatedText: translated,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      setIsTranslating(false);
      console.error('Translation error:', err);
      return null;
    }
  }, []);

  return {
    translate,
    translatedText,
    isTranslating,
    error,
  };
};

// Supported languages for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'et', name: 'Estonian' },
  { code: 'fa', name: 'Persian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'sw', name: 'Swahili' },
  { code: 'tl', name: 'Filipino' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'ne', name: 'Nepali' },
  { code: 'ca', name: 'Catalan' },
];
