export const getLocaleDate = (date) =>
  new Date(date).toLocaleDateString("en-in", {
    month: "2-digit",
    year: "2-digit",
    day: "2-digit",
  });
