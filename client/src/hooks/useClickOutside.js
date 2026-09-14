import { useEffect } from "react";

export function useClickOutside(ref, cb) {
  function handleClick(e) {
    if (!ref.current?.contains(e.target)) cb();
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
}
