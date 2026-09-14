import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UploadCloudIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import pdfToText from "react-pdftotext";

import { dummyResumeData } from "../../public/assets/assets";
import { getLocaleDate } from "../utils/date-utils";
import Modal from "../components/Modal";
import {
  createResume as createResumeAction,
  deleteResume,
  getAllResumes,
  updateResume,
  uploadResume as uploadResumeAction,
} from "../api";

const colors = ["#9333ea", "#028457", "#d97706", "#dc2626", "#16a34a"];

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [resume, setResume] = useState(null);
  const [title, setTitle] = useState({ id: null, value: "" });
  const [loading, setLoading] = useState(false);

  const createResumeModal = useRef(null);
  const uploadResumeModal = useRef(null);
  const editResumeModal = useRef(null);
  const fileRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadResumes() {
      try {
        setLoading(true);
        const { data } = await getAllResumes();
        setResumes(data.resumes);
      } catch (error) {
        toast.error("Resumes are not loaded correctly");
      } finally {
        setLoading(false);
      }
    }
    void loadResumes();
  }, []);

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!window.confirm("Are you sure want to delete this resume?")) return;
    try {
      setLoading(true);
      const { message } = await deleteResume(id);
      toast.success(message);
      setResumes(resumes.filter((resume) => resume._id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createResume(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const { title } = Object.fromEntries(form);
    if (!title?.trim()) return;
    try {
      const { data } = await createResumeAction(title);
      setResumes([...resumes, data.resume]);
      createResumeModal.current?.close();
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function uploadResume(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const { title } = Object.fromEntries(form);
    if (!title?.trim()) return;
    try {
      setLoading(true);
      const resumeText = await pdfToText(resume);
      const { data } = await uploadResumeAction(title, resumeText);
      setResume(null);
      uploadResumeModal.current?.close();
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(e, currentResume) {
    e.stopPropagation();
    setTitle((prev) => ({
      ...prev,
      id: currentResume._id,
      value: currentResume.title,
    }));
    editResumeModal.current?.open();
  }

  async function editTitle(e) {
    e.preventDefault();
    if (!title.value?.trim()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resumeId", title.id);
      formData.append("resumeData", JSON.stringify({ title: title.value }));
      const { message } = await updateResume(formData);
      editResumeModal.current?.close();
      setResumes(
        resumes.map((res) =>
          res._id === title.id ? { ...res, title: title.value } : res,
        ),
      );
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="max-w-7xl px-4 py-8 mx-auto">
        <p className="text-2xl mb-6 font-medium bg-linear-to-r from-slate-600 to-slate-700 text-transparent bg-clip-text sm:hidden">
          Welcome, John Doe
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => createResumeModal.current?.open()}
            className="flex flex-col items-center w-full bg-white sm:max-w-36 h-48 justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg cursor-pointer transition"
          >
            <PlusIcon className="size-11 duration-300 p-2.5 bg-linear-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="transition-colors group-hover:text-indigo-600 duration-300 text-sm">
              Create Resume
            </p>
          </button>
          <button
            onClick={() => uploadResumeModal.current?.open()}
            className="flex flex-col items-center w-full bg-white sm:max-w-36 h-48 justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg cursor-pointer transition"
          >
            <UploadCloudIcon className="size-11 duration-300 p-2.5 bg-linear-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="transition-colors group-hover:text-purple-600 duration-300 text-sm">
              Upload Existing
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-76.25" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {resumes.map((resume, i) => {
            const baseColor = colors[i];
            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                  pointerEvents: loading ? "none" : "auto",
                }}
                className="relative w-full sm:max-w-36 h-48 flex flex-col justify-center items-center rounded-lg gap-2 border group hover:shadow-lg transition-all cursor-pointer duration-300"
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition"
                  style={{ color: baseColor }}
                />
                <p className="text-sm group-hover:scale-105 text-center px-2 transition">
                  {resume.title}
                </p>
                <p
                  style={{ color: baseColor + "90" }}
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 duration-300 px-2 text-center"
                >
                  Updated on {getLocaleDate(resume.updatedAt)}
                </p>
                <div className="absolute top-1 right-1 hidden group-hover:flex items-center">
                  <Trash2Icon
                    className="size-7 p-1.5 hover:bg-white/50 transition-colors rounded text-slate-700"
                    onClick={(e) => handleDelete(e, resume._id)}
                  />
                  <PencilIcon
                    onClick={(e) => handleEdit(e, resume)}
                    className="size-7 p-1.5 hover:bg-white/50 transition-colors rounded text-slate-700"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Create resume */}
        <Modal title="Create a Resume" ref={createResumeModal}>
          <form
            onSubmit={(e) =>
              toast.promise(createResume(e), { loading: "Creating..." })
            }
          >
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-gray-600"
              placeholder="Enter resume title"
              required
            />
            <button className="w-full py-2 bg-green-800 text-white rounded hover:bg-green-700 transition-colors">
              Create Resume
            </button>
          </form>
        </Modal>

        {/* Update resume */}
        <Modal title="Upload Resume" ref={uploadResumeModal} loading={loading}>
          <form onSubmit={uploadResume}>
            <input
              type="text"
              name="title"
              className={
                "w-full px-4 py-2 mb-4 focus:border-green-600 ring-gray-600 " +
                (loading ? "bg-gray-300/50 cursor-default" : "")
              }
              placeholder="Enter resume title"
              readOnly={loading}
              required
            />
            <div>
              <label
                htmlFor="resume-input"
                className="block text-sm text-slate-700"
              >
                Select resume file
                <div
                  onClick={() => !loading && fileRef.current?.click()}
                  className={
                    "flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md my-4 py-10 px-4 transition-colors " +
                    (loading
                      ? "bg-gray-300/50 hover:bg-gray-300/50 cursor-not-allowed"
                      : "hover:border-gray-500 hover:text-gray-700 cursor-pointer")
                  }
                >
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloudIcon className="size-14 stroke-1" />
                      <p>Upload resume</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </label>
            </div>
            <button
              disabled={loading}
              className="w-full py-2 bg-green-800 text-white rounded flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:bg-green-500 disabled:hover:bg-green-500"
            >
              {loading && (
                <LoaderCircleIcon className="size-4 animate-spin text-white" />
              )}
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>
        </Modal>

        {/* Edit resume */}
        <Modal
          title="Edit Resume Title"
          ref={editResumeModal}
          loading={loading}
        >
          <form onSubmit={editTitle}>
            <input
              type="text"
              value={title?.value}
              onChange={(e) =>
                setTitle((prev) => ({ ...prev, value: e.target.value }))
              }
              className={
                "w-full px-4 py-2 mb-4 focus:border-green-600 ring-gray-600 " +
                (loading ? "bg-gray-300/50 cursor-default" : "")
              }
              placeholder="Enter resume title"
              readOnly={loading}
              required
            />
            <button
              disabled={loading}
              className="w-full py-2 flex justify-center items-center gap-2 bg-green-800 text-white rounded hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:bg-green-500 disabled:hover:bg-green-500"
            >
              {loading && (
                <LoaderCircleIcon className="size-4 animate-spin text-white" />
              )}
              {loading ? "Updating" : "Update"}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
