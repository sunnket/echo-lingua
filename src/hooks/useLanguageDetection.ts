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
    if (!text || text.trim().length < 3) {
      setDetectedLanguage(null);
      setAllDetections([]);
      return null;
    }

    setIsDetecting(true);

    try {
      // Get all language detections with confidence scores
      const detections = francAll(text, { minLength: 3 });
      
      if (!detections.length || detections[0][0] === 'und') {
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
