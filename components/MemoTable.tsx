import React, { useState } from "react";
import Link from "next/link";

export default function MemoTable({
  memos,
  onDelete,
  onEdit,
}: {
  memos: any[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
}) {
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  if (memos.length === 0) {
    return <p className="mt-4 text-gray-500">No memos yet.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto mt-6 rounded shadow">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-blue-100 font-semibold text-blue-900">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Memo No</th>
              <th className="px-4 py-2 border">Company</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {memos.map((memo, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>

                <td className="px-4 py-2 border text-blue-600 hover:underline">
                  <Link href={`/memo/${index}`}>{memo.memoNo}</Link>
                </td>

                <td className="px-4 py-2 border text-blue-600 hover:underline">
                  <Link href={`/memo/${index}`}>{memo.company}</Link>
                </td>

                <td className="px-4 py-2 border text-center space-x-2">
                  
                  <button
                    onClick={() => setPendingDelete(index)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {pendingDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Delete Memo #{pendingDelete + 1}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onDelete(pendingDelete);
                  setPendingDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
