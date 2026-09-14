import { Plus, Trash2Icon } from "lucide-react";

export default function ProjectForm({ data, onChange }) {
  console.log(data);
  function addProject() {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  }

  function removeProject(index) {
    onChange(data.filter((_, i) => i !== index));
  }

  function updateProject(index, field, value) {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your projects</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" /> Add Project
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="flex items-start justify-between">
              <h4>Project #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transform-colors"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
            <div className="grid gap-3">
              <input
                type="text"
                required
                value={project.name ?? ""}
                className="px-3 py-2 text-sm rounded-lg"
                placeholder="Project Name"
                onChange={(e) => updateProject(index, "name", e.target.value)}
              />
              <input
                type="text"
                required
                value={project.type ?? ""}
                className="px-3 py-2 text-sm rounded-lg"
                placeholder="Project Type"
                onChange={(e) => updateProject(index, "type", e.target.value)}
              />
              <textarea
                className="px-3 py-2 w-full resize-none rounded-lg text-sm"
                rows={4}
                value={project.description}
                placeholder="Describe your project..."
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
