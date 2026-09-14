import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";

export default function SkillsForm({ data = [], onChange }) {
  const [newSkill, setNewSkill] = useState("");

  function addNewSkill() {
    if (newSkill.trim() && !data.includes(newSkill)) {
      onChange([...data, newSkill.trim()]);
      setNewSkill("");
    }
  }

  function removeNewSkill(index) {
    onChange(data.filter((_, i) => i !== index));
  }

  function handleEnter(e) {
    e.preventDefault();
    addNewSkill();
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
          Skills
        </h3>
        <p>Add your technical and soft skills</p>
      </div>
      <form onSubmit={handleEnter} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter a skill (e.g., Javascript, Project Management)"
          className="flex-1 px-3 py-2 text-sm"
          onChange={(e) => setNewSkill(e.target.value)}
          value={newSkill}
        />
        <button
          type="button"
          disabled={!newSkill.trim()}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="size-4" /> Add
        </button>
      </form>
      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, id) => (
            <span
              key={id}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeNewSkill(id)}
                className="ml-1 rounded-full p-0.5 transition-colors hover:bg-blue-200"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Sparkles className="size-10 mx-auto mb-2 text-gray-300" />
          <p>No Skills added yet.</p>
          <p className="text-sm">Add your technical and soft skills above</p>
        </div>
      )}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Add 8-12 relevant skills. Include both soft
          skills(leadership, communication) and technical skills(programming
          language, tools).
        </p>
      </div>
    </div>
  );
}
