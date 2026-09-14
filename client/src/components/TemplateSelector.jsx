import { Check, Layout } from "lucide-react";
import { useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

const templates = [
  {
    id: "classic",
    name: "Classic",
    preview:
      "A clean, traditional resume format with clear sections and professional typography",
  },
  {
    id: "modern",
    name: "Modern",
    preview:
      "Sleek design with strategic use of colors and modern font choices",
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "Minimal image with single image and clean typography",
  },
  {
    id: "minimal-image",
    name: "Minimal Image",
    preview: "Ultra-clean design that puts your content front and center",
  },
];
export default function TemplateSelector({ onChange, selectedTemplate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [temp, setTemp] = useState(selectedTemplate);
  const templateRef = useRef(null);
  const timer = useRef(null);
  useClickOutside(templateRef, () => setIsOpen(false));

  function handleLeave() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(temp), 200);
  }

  function handleEnter(template) {
    clearTimeout(timer.current);
    onChange(template);
  }

  return (
    <div className="relative" ref={templateRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-linear-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} />
        <span className="max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <div
              key={template.id}
              onMouseEnter={() => handleEnter(template.id)}
              onMouseLeave={handleLeave}
              onClick={() => {
                onChange(template.id);
                setTemp(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all ${selectedTemplate === template.id ? "border-blue-400 bg-blue-100" : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"}`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Check className="size-3 text-white" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs italic text-gray-500">
                  {template.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
