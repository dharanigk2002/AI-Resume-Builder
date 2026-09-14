export default function Title({ title, description }) {
  return (
    <div className="text-center mt-6 space-y-4 text-slate-700">
      <h1 className="text-3xl sm:text-4xl font-medium">{title}</h1>
      <p>{description}</p>
    </div>
  );
}
