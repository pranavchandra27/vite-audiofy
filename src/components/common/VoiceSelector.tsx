import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (value: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,

  onVoiceChange,
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="gender" className="font-normal">
        Voice
      </Label>
      <RadioGroup
        id="gender"
        defaultValue="comfortable"
        value={selectedVoice}
        onValueChange={onVoiceChange}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="FEMALE" id="female" />
          <Label className="font-normal" htmlFor="female">
            English - Female
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="MALE" id="male" />
          <Label className="font-normal" htmlFor="male">
            English - Male
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default VoiceSelector;
