import { useMemo } from "react";

import ModernTemplate from "../templates/ModernTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import MinimalImageTemplate from "../templates/MinimalImageTemplate";
import ClassicTemplate from "../templates/ClassicTemplate";

import "./resume-preview.css";

export default function ResumePreview({
  data,
  template,
  accentColor,
  classes = "",
}) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return ModernTemplate;
      case "minimal":
        return MinimalTemplate;
      case "minimal-image":
        return MinimalImageTemplate;
      default:
        return ClassicTemplate;
    }
  };
  const Template = useMemo(renderTemplate, [template]);
  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:border-none print:shadow-none " +
          classes
        }
      >
        <Template data={data} accentColor={accentColor} />
      </div>
    </div>
  );
}
