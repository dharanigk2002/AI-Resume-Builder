import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ResumePreview from "../components/ResumePreview/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import { getResumeById } from "../api";
import toast from "react-hot-toast";

export default function Preview() {
  const { resumeId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  async function loadResumeData() {
    try {
      setIsLoading(true);
      const { data } = await getResumeById(resumeId);
      setResumeData(data.resume);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadResumeData();
  }, [resumeId]);

  if (isLoading) return <Loader />;
  else if (!resumeData)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-6xl text-center font-medium text-slate-400">
          Resume not found
        </p>
        <Link
          to="/app"
          className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-gray-400 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" /> Go to homepage
        </Link>
      </div>
    );

  return (
    <div className="bg-slate-100">
      <div className="mx-auto max-w-3xl py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  );
}
