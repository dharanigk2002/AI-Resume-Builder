import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      default: "Untitled Resume",
    },
    public: {
      type: Boolean,
      default: false,
    },
    template: {
      type: String,
      default: "classic",
    },
    accent_color: {
      type: String,
      default: "#3bf286",
    },
    professional_summary: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        default: "",
      },
    ],
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: {
        type: String,
        default: "",
        match: [/^\S+@\S+\.\S{2,}$/, "Please enter a valid email"],
      },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: String,
        position: String,
        description: String,
        start_date: Date,
        end_date: Date,
        is_current: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        graduation_date: Date,
        gpa: String,
      },
    ],
    projects: { type: [projectSchema], default: [] },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
