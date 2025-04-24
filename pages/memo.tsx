import { useEffect, useState } from "react";
import MemoForm from "../components/MemoForm";
import MemoTable from "../components/MemoTable";
import { getMemos, saveMemos } from "../utils/storage";

export default function MemoPage() {
  const [memos, setMemos] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    setMemos(getMemos());
  }, []);

  const handleAddMemo = (memo: any) => {
    const updated = [...memos];
    if (editIndex !== null) {
      updated[editIndex] = memo;
    } else {
      updated.push(memo);
    }
    setMemos(updated);
    saveMemos(updated);
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = memos.filter((_, i) => i !== index);
    setMemos(updated);
    saveMemos(updated);
    setEditIndex(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Memo Manager</h1>
      <MemoForm
        onAdd={handleAddMemo}
        initialData={editIndex !== null ? memos[editIndex] : null}
      />
      <MemoTable memos={memos} onEdit={setEditIndex} onDelete={handleDelete} />
    </div>
  );
}
