"use client";

import { useState, useEffect } from "react";

const SUGGESTED_SYMPTOMS = [
  "Chest Pain",
  "Fever",
  "Shortness of Breath",
  "Headache",
  "Dizziness",
  "Abdominal Pain",
  "Nausea",
  "Bleeding",
  "Fracture",
  "Confusion",
];

interface SymptomSelectorProps {
  onChange: (symptoms: string) => void;
  initialValue?: string;
}

export default function SymptomSelector({ onChange, initialValue = "" }: SymptomSelectorProps) {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  // Sync with initial value if provided (e.g. from state)
  useEffect(() => {
    // Only parse if initialValue is complex? Actually simpler to just track local state and bubbles up.
  }, []);

  const toggleChip = (chip: string) => {
    const updated = selectedChips.includes(chip)
      ? selectedChips.filter((c) => c !== chip)
      : [...selectedChips, chip];
    setSelectedChips(updated);
    notifyChange(updated, customText);
  };

  const handleTextChange = (text: string) => {
    setCustomText(text);
    notifyChange(selectedChips, text);
  };

  const notifyChange = (chips: string[], text: string) => {
    const chipString = chips.join(", ");
    const finalString = [chipString, text].filter(Boolean).join(". ");
    onChange(finalString);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_SYMPTOMS.map((chip) => {
          const isSelected = selectedChips.includes(chip);
          return (
            <button
              key={chip}
              type="button"
              onClick={() => toggleChip(chip)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? "bg-medical-blue text-white border-medical-blue shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-medical-blue hover:text-medical-blue"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
      
      <div className="relative">
        <textarea
          value={customText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Add other symptoms (optional)..."
          className="field-input min-h-[100px] resize-none"
        />
        {selectedChips.length > 0 && (
          <div className="mt-2 text-xs text-slate-500">
            Selected: <span className="font-semibold text-medical-blue">{selectedChips.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
