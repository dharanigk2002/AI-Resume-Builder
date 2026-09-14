import { Briefcase, Loader2, Plus, Sparkle, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { enhanceProfessionalExperience } from "../api";
import toast from "react-hot-toast";

export default function ExperienceForm({ data, onChange }) {
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  async function generateExperience(index) {
    try {
      setGeneratingIndex(index);
      const experience = data[index];
      const response = await enhanceProfessionalExperience({
        userContent: `Enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`,
      });
      updateExperience(index, "description", response.data.enhancedContent);
      toast.success(response.message ?? "Enhanced job description");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  }

  function addExperience() {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  }

  function removeExperience(index) {
    onChange(data.filter((_, i) => i !== index));
  }

  function updateExperience(index, field, value) {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>
        <button
          onClick={addExperience}
          type="button"
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" /> Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Briefcase className="size-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, ind) => (
            <div
              key={ind}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <h4>Experience #{ind + 1}</h4>
                <button
                  onClick={() => removeExperience(ind)}
                  type="button"
                  className="text-red-500 hover:text-red-700 transform-colors"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={exp.company ?? ""}
                  className="px-3 py-2 text-sm rounded-lg"
                  placeholder="Company Name"
                  required
                  onChange={(e) =>
                    updateExperience(ind, "company", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={exp.position ?? ""}
                  required
                  className="px-3 py-2 text-sm rounded-lg"
                  placeholder="Job Title"
                  onChange={(e) =>
                    updateExperience(ind, "position", e.target.value)
                  }
                />
                <input
                  type="month"
                  required
                  value={exp.start_date.slice(0, 7) ?? ""}
                  className="px-3 py-2 text-sm rounded-lg"
                  onChange={(e) =>
                    updateExperience(ind, "start_date", e.target.value)
                  }
                />
                <input
                  type="month"
                  value={exp.end_date.slice(0, 7) ?? ""}
                  disabled={exp.is_current}
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                  onChange={(e) =>
                    updateExperience(ind, "end_date", e.target.value)
                  }
                />
              </div>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={exp.is_current ?? false}
                  onChange={(e) =>
                    updateExperience(ind, "is_current", e.target.checked)
                  }
                  className="border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <button
                    onClick={() => generateExperience(ind)}
                    type="button"
                    disabled={generatingIndex === ind}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transform-colors disabled:opacity-50"
                  >
                    {generatingIndex === ind ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <Sparkle className="size-3" />
                    )}{" "}
                    {generatingIndex === ind
                      ? "Enhancing..."
                      : "Enhance with AI"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={exp.description ?? ""}
                  onChange={(e) =>
                    updateExperience(ind, "description", e.target.value)
                  }
                  className="w-full text-sm rounded-lg px-3 py-2 resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
