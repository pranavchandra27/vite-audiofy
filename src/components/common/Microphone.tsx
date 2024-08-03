import { useState } from "react";
import { Button } from "../ui/button";
import { Mic } from "lucide-react";

interface MicrophoneButtonProps {
  onResult: (transcript: string) => void;
}

const Microphone: React.FC<MicrophoneButtonProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let recognition: SpeechRecognition | null = null;

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition();
    } else if ("SpeechRecognition" in window) {
      recognition = new (window as any).SpeechRecognition();
    } else {
      setError("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (!recognition) return;

    recognition!.continuous = false;
    recognition!.interimResults = false;
    recognition!.lang = "en-US";

    recognition!.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition!.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition!.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition!.onend = () => {
      setIsListening(false);
    };

    try {
      recognition!.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setError("Error starting speech recognition!.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition!.stop();
      setIsListening(false);
    }
  };

  return (
    <>
      {" "}
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <Button
        size={isListening ? "sm" : "icon"}
        onClick={isListening ? stopListening : startListening}
        variant={isListening ? "secondary" : "ghost"}
      >
        {isListening && <span className="mr-2">Listening...</span>}{" "}
        <Mic className="size-4" />
      </Button>
    </>
  );
};

export default Microphone;
