import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import { dummyResumeData } from "../../public/assets/assets";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { getResumeById, updateResume } from "../api";

const sections = [
  { id: "personal", name: "Personal Info", Icon: User },
  { id: "summary", name: "Summary", Icon: FileText },
  { id: "experience", name: "Experience", Icon: Briefcase },
  { id: "education", name: "Education", Icon: GraduationCap },
  { id: "projects", name: "Projects", Icon: FolderIcon },
  { id: "skills", name: "Skills", Icon: Sparkles },
];

export default function ResumeBuilder() {
  const { resumeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resumeData, setResumeData] = useState({
    personal_info: {},
    _id: "",
    userId: "",
    title: "",
    public: true,
    professional_summary: "",
    skills: [],
    experience: [],
    education: [],
    template: "",
    accent_color: "",
    project: [],
    updatedAt: "",
    createdAt: "",
  });
  const [activeSectionIndex, setActiveSectionIndex] = useState(() =>
    searchParams.get("state")
      ? sections.findIndex(
          (section) => section.id === searchParams.get("state"),
        )
      : 0,
  );
  const [removeBg, setRemoveBg] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const { data } = await getResumeById(resumeId);
        setResumeData(data.resume);
        document.title = data.resume.title;
      } catch (error) {
        toast.error(error.message);
      }
    }
    void fetchResume();
  }, [resumeId]);

  const activeSection = useMemo(
    () => sections[activeSectionIndex],
    [activeSectionIndex],
  );
  const totalSections = useMemo(() => sections.length, [sections]);

  async function changeResumeVisibility() {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );
      const { message } = await updateResume(formData);
      setResumeData((prev) => ({ ...prev, public: !prev.public }));
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function goToNext() {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    const nextSectionIndex = Math.min(
      totalSections - 1,
      activeSectionIndex + 1,
    );
    setSearchParams({
      state: sections[nextSectionIndex].id,
    });
    setActiveSectionIndex(nextSectionIndex);
  }

  function goToPrev() {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    const prevSectionIndex = Math.max(0, activeSectionIndex - 1);
    setSearchParams({
      state: sections[prevSectionIndex].id,
    });
    setActiveSectionIndex(prevSectionIndex);
  }

  async function saveResume(e) {
    e.preventDefault();
    try {
      const updatedResume = JSON.parse(JSON.stringify(resumeData));
      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResume.personal_info.image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResume));
      removeBg && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === "object" &&
        formData.append("image", resumeData.personal_info.image);
      const { data, message } = await updateResume(formData);
      setResumeData(data.resume);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleShare() {
    const [url] = window.location.href.split("/app/");
    const shareableUrl = url + "/view/" + resumeId;
    if (navigator.share)
      navigator.share({ url: shareableUrl, text: "My Resume" });
    else window.alert("Sharing is not supported on this device");
  }

  function downloadResume() {
    window.print();
  }

  async function loadResume() {
    const resume = dummyResumeData.find((data) => data._id === resumeId);
    if (!resume) return;
    setResumeData(resume);
    document.title = resume.title;
  }

  useEffect(() => {
    void loadResume();
  }, [resumeId]);

  return (
    <div>
      <div className="max-w-7xl w-full mx-auto px-4 py-6">
        <Link
          to=".."
          className="inline-flex gap-2 items-center text-slate-500 transition-all hover:text-slate-700"
        >
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left panel-form */}
          <form
            ref={formRef}
            onSubmit={saveResume}
            className="relative lg:col-span-5 rounded-lg overflow-hidden"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              <hr className="absolute inset-0 border-2 border-gray-200" />
              <hr
                style={{
                  width: `${(activeSectionIndex / (totalSections - 1)) * 100}%`,
                }}
                className="absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transition-all duration-800"
              />
              {/* Section navigation */}
              <div className="flex justify-between items-center mb-6 border-b py-1 border-gray-300">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    onChange={(accent_color) =>
                      setResumeData((prev) => ({ ...prev, accent_color }))
                    }
                    selectedColor={resumeData.accent_color}
                  />
                </div>
                <div className="flex items-center justify-between">
                  {activeSectionIndex > 0 && (
                    <button
                      type="button"
                      onClick={goToPrev}
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={activeSectionIndex === totalSections - 1}
                    className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:pointer-events-none disabled:opacity-50"
                  >
                    <ChevronRight className="size-4" /> Next
                  </button>
                </div>
              </div>

              {/* Form content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => {
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }));
                    }}
                    removeBg={removeBg}
                    setRemoveBg={setRemoveBg}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, experience: data }))
                    }
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.projects}
                    onChange={(projects) =>
                      setResumeData((prev) => ({ ...prev, projects }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(skills) =>
                      setResumeData((prev) => ({ ...prev, skills }))
                    }
                  />
                )}
              </div>
              <button
                onClick={() =>
                  toast.promise(saveResume, { loading: "Saving..." })
                }
                className="bg-linear-to-br from-green-100 to-gray-200 ring-gray-300 text-green-600 ring hover:ring-gray-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Right panel-preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute left-0 right-0 bottom-3 flex justify-end items-center gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" />
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
