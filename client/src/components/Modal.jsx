import { XIcon } from "lucide-react";
import { useImperativeHandle, useState } from "react";

export default function Modal({ title, loading, children, ref }) {
  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setActive(true);
    },

    close() {
      setActive(false);
    },

    get isActive() {
      return active;
    },
  }));

  return (
    <div
      onClick={() => setActive(false)}
      className={`fixed inset-0 bg-black/70 items-center justify-center backdrop-blur-[2px] flex transition-all duration-300 ${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-slate-50 border transition-all duration-300 rounded-lg shadow-md w-full p-6 max-w-sm ${active ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <XIcon
          onClick={() => {
            !loading && setActive(false);
          }}
          className={
            "absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors " +
            (loading ? "pointer-events-none" : "pointer-events-auto")
          }
        />
      </div>
    </div>
  );
}
