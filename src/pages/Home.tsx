import React, { useRef, useState } from "react";
import Header from "@/components/common/Header";
import { synthesizeSpeech } from "@/services/textToSpeechService";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import VoiceSelector from "@/components/common/VoiceSelector";
import Speed from "@/components/common/Speed";
import {
  DownloadIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Microphone from "@/components/common/Microphone";

const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [selectedVoice, setSelectedVoice] = useState("FEMALE");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0]);
  const [duration, setDuration] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const audioPath = await synthesizeSpeech(text, selectedVoice, speed[0]);
      setAudioUrl(audioPath);
    } catch (error) {
      console.error("Error generating voice-over:", error);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "voice-over.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setText(value);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime([audioRef.current.currentTime]);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime([audioRef.current.currentTime]);
    }
  };

  const handleSeekBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5
      );
      setCurrentTime([audioRef.current.currentTime]);
    }
  };

  const handleSeekForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 5
      );
      setCurrentTime([audioRef.current.currentTime]);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime([0]);
  };

  const handleMicResult = (transcript: string) => {
    console.log(transcript);
    setText(transcript);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="p-4 max-w-7xl mx-auto">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="flex-1">
            <div className="border border-gray-300 rounded">
              <div className="flex items-center justify-between border-b border-gray-300 py-2 px-6">
                <p className="font-medium">Text</p>
                <Microphone onResult={handleMicResult} />
              </div>
              <Textarea
                placeholder="Type your text here..."
                value={text}
                className="resize-none border-none p-6 outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                rows={8}
                onChange={handleChange}
              />
            </div>

            {audioUrl && (
              <div className="mt-5 border border-gray-300 rounded">
                <div className="flex items-center justify-between border-b border-gray-300 py-2 px-6">
                  <p className="font-medium">Speech</p>
                  <Button onClick={handleDownload} variant="ghost">
                    <DownloadIcon className="size-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="">
                  <div className="flex items-center justify-between p-4 bg-white">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      className="hidden"
                      onEnded={handleEnded}
                    ></audio>
                    <div className="flex">
                      <Button
                        onClick={handleSeekBackward}
                        variant="ghost"
                        size="icon"
                      >
                        <SkipBackIcon className="size-4" />
                      </Button>

                      <Button
                        size="icon"
                        onClick={togglePlayPause}
                        variant="ghost"
                      >
                        {isPlaying ? (
                          <PauseCircleIcon className="size-6" />
                        ) : (
                          <PlayCircleIcon className="size-6" />
                        )}
                      </Button>

                      <Button
                        onClick={handleSeekForward}
                        variant="ghost"
                        size="icon"
                      >
                        <SkipForwardIcon className="size-4" />
                      </Button>
                    </div>

                    <div className="flex flex-1">
                      <Slider
                        value={currentTime}
                        max={duration}
                        min={0}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="mx-4"
                      />

                      <span className="text-gray-600 w-[160px] text-sm">
                        {new Date(currentTime[0] * 1000)
                          .toISOString()
                          .substr(14, 5)}{" "}
                        /{" "}
                        {new Date(duration * 1000).toISOString().substr(14, 5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-[280px]">
            <VoiceSelector
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
            />

            <Speed speed={speed} onSpeedChange={setSpeed} />

            <Button
              onClick={handleGenerate}
              disabled={loading || !text}
              size="sm"
              className="mt-6"
            >
              Submit
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
