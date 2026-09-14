import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { enhanceSummary } from "../api";

export default function ProfessionalSummaryForm({
  data,
  onChange,
  setResumeData,
}) {
  const [generating, setGenerating] = useState(false);

  async function generateSummary() {
    try {
      setGenerating(true);
      const response = await enhanceSummary({
        userContent: `Enhance my professional summary: "${data}"`,
      });
      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedContent,
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="spce-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>
        <button
          onClick={generateSummary}
          type="button"
          disabled={generating}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Sparkles className="size-4" />
          )}{" "}
          {generating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>
      <div className="mt-6">
        <textarea
          value={data ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
        />
        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
}
