import {
  BriefcaseBusiness,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
  UserIcon,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

const fields = [
  {
    key: "full_name",
    label: "Full Name",
    Icon: User,
    type: "text",
    required: true,
  },
  {
    key: "email",
    label: "Email",
    Icon: Mail,
    type: "email",
    required: true,
  },
  {
    key: "phone",
    label: "Phone number",
    Icon: Phone,
    type: "tel",
  },
  {
    key: "location",
    label: "Location",
    Icon: MapPin,
    type: "text",
  },
  {
    key: "profession",
    label: "Profession",
    Icon: BriefcaseBusiness,
    type: "text",
  },
  {
    key: "linkedin",
    label: "Linkedin Profile",
    Icon: FaLinkedin,
    type: "url",
  },
  {
    key: "website",
    label: "Personal Website",
    Icon: Globe,
    type: "url",
  },
];

export default function PersonalInfoForm({
  data,
  onChange,
  removeBg,
  setRemoveBg,
}) {
  function handleChange(field, value) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p className="text-sm text-gray-600">
        Get started with perosnal information
      </p>
      <div className="flex items-center gap-2">
        <label>
          {data.image ? (
            <img
              src={
                typeof data.image === "string"
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              alt="user-image"
              className="size-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80"
            />
          ) : (
            <div className="flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer">
              <UserIcon className="size-10 p-2.5 border rounded-full" /> Upload
              user image
            </div>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            hidden
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>
        {typeof data.image === "object" && (
          <div className="text-sm flex flex-col gap-1 pl-4">
            <p>Remove Background</p>
            <label className="relative inline-flex items-center cursor-pointer gap-3 text-gray-900">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBg((prev) => !prev)}
                checked={removeBg}
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200" />
              <div className="absolute top-1 left-1 size-3 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
            </label>
          </div>
        )}
      </div>
      {fields.map((field) => (
        <div key={field.key} className="mt-5 space-y-1">
          <label
            htmlFor={field.key}
            className="flex items-center gap-2 text-sm font-medium text-gray-600"
          >
            <field.Icon className="size-4" />
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            id={field.key}
            value={data[field.key] ?? ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            required={field.required}
          />
        </div>
      ))}
    </div>
  );
}
