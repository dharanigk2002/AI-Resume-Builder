const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getUser() {
  const response = await fetch(`${BASE_URL}/api/users/data`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data);
  return data;
}

export async function login(credentials) {
  const response = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function signUp(credentials) {
  const response = await fetch(`${BASE_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function logout() {
  const response = await fetch(`${BASE_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function createResume(title) {
  const response = await fetch(`${BASE_URL}/api/resumes/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function uploadResume(title, resumeText) {
  const response = await fetch(`${BASE_URL}/api/ai/upload-resume`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeText, title }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function getResumeById(resumeId) {
  const response = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function getAllResumes() {
  const response = await fetch(`${BASE_URL}/api/users/resumes`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function deleteResume(resumeId) {
  const response = await fetch(`${BASE_URL}/api/resumes/${resumeId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function updateResume(resume) {
  const response = await fetch(`${BASE_URL}/api/resumes/update`, {
    method: "PUT",
    credentials: "include",
    body: resume,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function enhanceSummary(summary) {
  console.log(summary);
  const response = await fetch(`${BASE_URL}/api/ai/enhance-pro-sum`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(summary),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function enhanceProfessionalExperience(experience) {
  const response = await fetch(`${BASE_URL}/api/ai/enhance-job-desc`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(experience),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}
