type LanguageResult = {
  code: string;
  name: string;
  confidence: number;
};

/**
 * IMPORTANT:
 * Browsers CANNOT auto-detect spoken language reliably.
 * So we treat the user-selected language as detected language.
 */
export function useLanguageDetection() {
  const detectLanguage = (languageCode: string): LanguageResult => {
    const map: Record<string, string> = {
      "en-US": "English",
      "hi-IN": "Hindi",
      "fr-FR": "French",
      "es-ES": "Spanish",
      "de-DE": "German",
      "ja-JP": "Japanese",
      "zh-CN": "Chinese",
    };

    return {
      code: languageCode,
      name: map[languageCode] || "Unknown",
      confidence: 1.0, // Explicit & honest
    };
  };

  return { detectLanguage };
}

