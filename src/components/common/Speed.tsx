import React from "react";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface VoiceSelectorProps {
  speed: number[];
  onSpeedChange: (value: number[]) => void;
}

const Speed: React.FC<VoiceSelectorProps> = ({ speed, onSpeedChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value || "0");
    if (typeof value !== "number") return;
    onSpeedChange([value]);
  };
  return (
    <div className="mt-4">
      <Label htmlFor="speed" className="font-normal">
        Speed
      </Label>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm">0.25</span>
        <Slider
          id="speed"
          value={speed}
          max={4}
          min={0.25}
          step={0.1}
          className={cn("w-[60%] flex-grow")}
          onValueChange={onSpeedChange}
        />
        <span className="text-sm">4</span>
        <input
          className="w-10 p-1 border border-gray-300 rounded text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={speed[0]}
          type="number"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Speed;
