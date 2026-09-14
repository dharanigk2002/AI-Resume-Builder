import { Check, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

const colors = [
  { name: "Navy Blue", value: "#1E3A5F" },
  { name: "Professional Blue", value: "#2563EB" },
  { name: "Slate", value: "#475569" },
  { name: "Charcoal", value: "#374151" },
  { name: "Teal", value: "#0F766E" },
  { name: "Forest Green", value: "#166534" },
  { name: "Indigo", value: "#4338CA" },
  { name: "Burgundy", value: "#9F1239" },
  { name: "Brown", value: "#92400E" },
  { name: "Black", value: "#111827" },
  { name: "Baby Pink", value: "#F9A8D4" },
];

export default function ColorPicker({ onChange, selectedColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [temp, setTemp] = useState(selectedColor);
  const timer = useRef(null);
  const pickerRef = useRef(null);

  useClickOutside(pickerRef, () => setIsOpen(false));

  function handleLeave() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(temp), 200);
  }

  function handleEnter(color) {
    clearTimeout(timer.current);
    onChange(color);
  }

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-linear-to-r from bg-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Palette size={16} />
        <span className="max-sm:hidden">Accent</span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-4 w-60 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-300 shadow-sm">
          {colors.map((color) => (
            <div
              key={color.name}
              className="cursor-pointer group flex flex-col"
              onMouseEnter={() => handleEnter(color.value)}
              onMouseLeave={handleLeave}
              onClick={() => {
                onChange(color.value);
                setTemp(color.value);
                clearTimeout(timer.current);
                setIsOpen(false);
              }}
            >
              <div
                className="relative size-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors"
                style={{ backgroundColor: color.value }}
              >
                {selectedColor === color.value && (
                  <div className="absolute top-[50%] left-[50%] translate-[-50%]">
                    <Check className="size-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
