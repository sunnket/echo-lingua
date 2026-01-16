import { useState, useCallback } from 'react';
import { franc, francAll } from 'franc';
import ISO6391 from 'iso-639-1';

interface DetectionResult {
  language: string;
  code: string;
  confidence: number;
}

interface LanguageDetectionHook {
  detectLanguage: (text: string) => DetectionResult | null;
  detectedLanguage: DetectionResult | null;
  isDetecting: boolean;
  allDetections: DetectionResult[];
}

// Map of franc ISO 639-3 codes to ISO 639-1 codes
const iso3ToIso1Map: Record<string, string> = {
  eng: 'en',
  spa: 'es',
  fra: 'fr',
  deu: 'de',
  ita: 'it',
  por: 'pt',
  rus: 'ru',
  jpn: 'ja',
  kor: 'ko',
  zho: 'zh',
  cmn: 'zh',
  arb: 'ar',
  ara: 'ar',
  hin: 'hi',
  ben: 'bn',
  pan: 'pa',
  tam: 'ta',
  tel: 'te',
  mar: 'mr',
  guj: 'gu',
  kan: 'kn',
  mal: 'ml',
  tha: 'th',
  vie: 'vi',
  ind: 'id',
  msa: 'ms',
  tur: 'tr',
  pol: 'pl',
  ukr: 'uk',
  nld: 'nl',
  swe: 'sv',
  nor: 'no',
  dan: 'da',
  fin: 'fi',
  ell: 'el',
  heb: 'he',
  ces: 'cs',
  ron: 'ro',
  hun: 'hu',
  cat: 'ca',
  hrv: 'hr',
  slk: 'sk',
  slv: 'sl',
  srp: 'sr',
  bul: 'bg',
  lit: 'lt',
  lav: 'lv',
  est: 'et',
  fas: 'fa',
  urd: 'ur',
  swa: 'sw',
  tgl: 'tl',
  fil: 'tl',
  afr: 'af',
  nep: 'ne',
  sin: 'si',
  mya: 'my',
  khm: 'km',
  lao: 'lo',
  amh: 'am',
  hau: 'ha',
  yor: 'yo',
  ibo: 'ig',
  zul: 'zu',
  xho: 'xh',
};

// Additional language names for codes not in ISO-639-1
const additionalLanguageNames: Record<string, string> = {
  zh: 'Chinese',
  ar: 'Arabic',
};

// Common English words for short text detection
const commonEnglishWords = new Set([
  'i', 'my', 'me', 'you', 'your', 'we', 'us', 'our', 'they', 'them', 'their',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'the', 'a', 'an', 'this', 'that', 'these', 'those',
  'what', 'who', 'where', 'when', 'why', 'how', 'which',
  'and', 'or', 'but', 'if', 'then', 'so', 'because',
  'to', 'from', 'in', 'on', 'at', 'by', 'for', 'with', 'of',
  'hello', 'hi', 'hey', 'yes', 'no', 'please', 'thank', 'thanks', 'sorry',
  'name', 'like', 'want', 'need', 'can', 'help', 'know', 'think', 'go', 'come',
  'good', 'bad', 'new', 'old', 'big', 'small', 'great', 'nice',
  'day', 'time', 'year', 'today', 'now', 'here', 'there',
  'love', 'work', 'home', 'world', 'life', 'people', 'man', 'woman',
]);

// Check if text is likely English based on common words
const isLikelyEnglish = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/);
  const englishWordCount = words.filter(word => 
    commonEnglishWords.has(word.replace(/[^a-z]/g, ''))
  ).length;
  
  // If more than 40% of words are common English words, it's likely English
  return words.length > 0 && (englishWordCount / words.length) >= 0.4;
};

// Check if text contains non-Latin characters (indicates non-English)
const hasNonLatinCharacters = (text: string): boolean => {
  // Check for Cyrillic, Arabic, Chinese, Japanese, Korean, Hindi, etc.
  const nonLatinPattern = /[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0B00-\u0B7F\u0C00-\u0C7F\u0D00-\u0D7F\u0E00-\u0E7F\u0F00-\u0FFF]/;
  return nonLatinPattern.test(text);
};

export const useLanguageDetection = (): LanguageDetectionHook => {
  const [detectedLanguage, setDetectedLanguage] = useState<DetectionResult | null>(null);
  const [allDetections, setAllDetections] = useState<DetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const getLanguageName = (iso1Code: string): string => {
    const name = ISO6391.getName(iso1Code);
    if (name) return name;
    
    return additionalLanguageNames[iso1Code] || iso1Code.toUpperCase();
  };

  const convertIso3ToIso1 = (iso3Code: string): string => {
    return iso3ToIso1Map[iso3Code] || iso3Code.substring(0, 2);
  };

  const detectLanguage = useCallback((text: string): DetectionResult | null => {
    if (!text || text.trim().length < 2) {
      setDetectedLanguage(null);
      setAllDetections([]);
      return null;
    }

    setIsDetecting(true);

    try {
      const trimmedText = text.trim();
      
      // For short texts (less than 20 characters), use heuristics
      if (trimmedText.length < 20) {
        // Check for non-Latin scripts first
        if (hasNonLatinCharacters(trimmedText)) {
          // Use franc for non-Latin text
          const detected = franc(trimmedText, { minLength: 1 });
          if (detected !== 'und') {
            const iso1Code = convertIso3ToIso1(detected);
            const result: DetectionResult = {
              language: getLanguageName(iso1Code),
              code: iso1Code,
              confidence: 75,
            };
            setDetectedLanguage(result);
            setAllDetections([result]);
            setIsDetecting(false);
            return result;
          }
        }
        
        // For Latin text, check if it looks like English
        if (isLikelyEnglish(trimmedText)) {
          const result: DetectionResult = {
            language: 'English',
            code: 'en',
            confidence: 85,
          };
          setDetectedLanguage(result);
          setAllDetections([result]);
          setIsDetecting(false);
          return result;
        }
      }

      // For longer texts, use franc with multiple detections
      const detections = francAll(trimmedText, { minLength: 3 });
      
      if (!detections.length || detections[0][0] === 'und') {
        // Fallback: if text uses Latin alphabet and no detection, assume English
        if (!hasNonLatinCharacters(trimmedText)) {
          const result: DetectionResult = {
            language: 'English',
            code: 'en',
            confidence: 60,
          };
          setDetectedLanguage(result);
          setAllDetections([result]);
          setIsDetecting(false);
          return result;
        }
        
        setDetectedLanguage(null);
        setAllDetections([]);
        setIsDetecting(false);
        return null;
      }

      // Convert to our format with ISO 639-1 codes
      const results: DetectionResult[] = detections
        .filter(([code]) => code !== 'und')
        .slice(0, 5)
        .map(([iso3Code, score]) => {
          const iso1Code = convertIso3ToIso1(iso3Code);
          return {
            language: getLanguageName(iso1Code),
            code: iso1Code,
            confidence: Math.round(score * 100),
          };
        });

      // Additional check: if franc says it's not English but text looks English, prioritize English
      if (results.length > 0 && results[0].code !== 'en' && isLikelyEnglish(trimmedText)) {
        const englishResult: DetectionResult = {
          language: 'English',
          code: 'en',
          confidence: 80,
        };
        results.unshift(englishResult);
      }

      const topResult = results[0] || null;
      
      setDetectedLanguage(topResult);
      setAllDetections(results);
      setIsDetecting(false);

      return topResult;
    } catch (error) {
      console.error('Language detection error:', error);
      setIsDetecting(false);
      return null;
    }
  }, []);

  return {
    detectLanguage,
    detectedLanguage,
    isDetecting,
    allDetections,
  };
};
