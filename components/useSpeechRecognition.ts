import { useState, useRef, useEffect } from "react";

interface SpeechRecognitionHook {
  listening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

const useSpeechRecognition = (lang = "en-IN"): SpeechRecognitionHook => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const SpeechRecognition =
    (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      const newTranscript = event?.results?.[0]?.[0]?.transcript;
      if (newTranscript) {
        // Only update transcript with the new result
        setTranscript(newTranscript);
      }
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, [lang, isSupported]);

  const startListening = () => {
    if (!isSupported) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    setTranscript(""); // Clear transcript before starting
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      console.error("Error starting speech recognition:", e);
      setListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error("Error stopping speech recognition:", e);
    }
    setListening(false);
  };

  return { listening, transcript, startListening, stopListening, isSupported };
};

export default useSpeechRecognition;