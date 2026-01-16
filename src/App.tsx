import { useState } from "react";

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "fr-FR", label: "French" },
  { code: "es-ES", label: "Spanish" },
];

export default function App() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-US");

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  let recognition: any = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    recognition.lang = lang;
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };
  };

  const speakText = () => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Echo Lingua</h1>

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={startListening}>🎤 Speak</button>
      <button onClick={speakText} style={{ marginLeft: 10 }}>
        🔊 Play
      </button>

      <br /><br />

      <textarea
        rows={5}
        cols={50}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Speech or text appears here"
      />
    </div>
  );
}
