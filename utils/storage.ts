export const getMemos = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("memos");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const saveMemos = (memos: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("memos", JSON.stringify(memos));
  }
};
