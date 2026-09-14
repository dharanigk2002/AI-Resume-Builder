import { GraduationCap, Plus, Trash2Icon } from "lucide-react";

export default function EducationForm({ data, onChange }) {
  function addEducation() {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  }

  function removeEducation(index) {
    onChange(data.filter((_, i) => i !== index));
  }

  function updateEducation(index, field, value) {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" /> Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <GraduationCap className="size-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <h4>Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transform-colors"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={education.institution ?? ""}
                  className="px-3 py-2 text-sm"
                  placeholder="Institute Name"
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                />
                <input
                  type="text"
                  required
                  value={education.degree ?? ""}
                  className="px-3 py-2 text-sm"
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                />
                <input
                  value={education.field ?? ""}
                  required
                  className="px-3 py-2 text-sm"
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  placeholder="Field of Study"
                />
                <input
                  required
                  value={education.graduation_date ?? ""}
                  type="month"
                  placeholder="grad"
                  className="px-3 py-2 text-sm disabled:bg-gray-100"
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                />
              </div>
              <input
                value={education.gpa ?? ""}
                placeholder="GPA (optional)"
                className="px-3 py-2 text-sm disabled:bg-gray-100"
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
