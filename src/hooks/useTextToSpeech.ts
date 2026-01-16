export function useTextToSpeech() {
  const speak = (text: string, language: string) => {
    if (!text) return;

    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported in this browser");
      return;
    }

    // 🔴 CRITICAL FIX: clear previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;

    const voices = window.speechSynthesis.getVoices();

    // Try to match voice with language
    const matchingVoice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(language.toLowerCase())
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}

