import ai from "../config/ai.js";
import Resume from "../db/models/resume.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Controller for enhancing resume's professional summary
// /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = asyncHandler(
  async function (req, res) {
    const { userContent = undefined } = req.body;
    if (!userContent) throw new ApiError(400, "Missing required fields");

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. \
            The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. \
            Make it compelling and ATS-friendly and only return text no options or anything else.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json(new ApiResponse(200, { enhancedContent }));
  },
);

// Controller for enhancing resume's job description
// /api/ai/enhance-job-desc
export const enhanceJobDesc = asyncHandler(async function (req, res) {
  const { userContent } = req.body;
  if (!userContent) throw new ApiError(400, "Missing required fields");

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an expert in resume writing. Your task is to enhance the job description of a resume. \
        The job description should be only in 1-2 sentences also highlighting key responsibilities \
        and achievements. Use action verbs and quantifiable results where possible \
        Make it compelling and ATS-friendly and only return text no options or anything else.",
      },
      { role: "user", content: userContent },
    ],
  });

  const enhancedContent = response.choices[0].message.content;
  return res.status(200).json(new ApiResponse(200, { enhancedContent }));
});

// Controller for uploading resume to db
// /api/ai/upload-resume
export const uploadResume = asyncHandler(async function (req, res) {
  const { resumeText, title } = req.body;
  const userId = req.user._id;

  if (!resumeText) throw new ApiError(400, "Missing required fields");

  const userContent = `extract data from this resume: ${resumeText}.
    Provide response in the following JSON format with no additional text before or after:
    {
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
                match: [/^\S+@\S+\.\S{2, 3}$/, "Please enter a valid email"],
        },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
        experience: [
            {
                company: String,
                position: String,
                description:String,
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
                gpa: { type: String, default: "" },
            },
        ],
        projects: [
            {
                name: String,
                type: String,
                description: String,
            },
        ],
    }
  `;

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: "You are an expert AI agent to extract data from resume",
      },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
  });

  const extractedData = response.choices[0].message.content;
  const parsedData = JSON.parse(extractedData);

  const newResume = await Resume.create({ userId, title, ...parsedData });
  return res
    .status(200)
    .json(new ApiResponse(200, { resumeId: newResume._id }));
});
