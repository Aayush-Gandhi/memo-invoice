import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMemos, saveMemos } from "../../utils/storage";
import DownloadPDFButton from "../../components/DownloadPdfButton";

export default function MemoDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [memos, setMemos] = useState<any[]>([]);
  const [memo, setMemo] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const memos = getMemos();
    setMemos(memos);
    if (id !== undefined && !Array.isArray(id)) {
      setMemo(memos[parseInt(id)]);
    }
  }, [id]);

  const handleDownloadCSV = () => {
    if (!memo) return;

    const headers = ["Item", "Rate", "Carat", "Amount", "Remarks"];
    const rows = memo.items.map((item: any) => [
      item.item,
      item.rate,
      item.carat,
      (parseFloat(item.rate || "0") * parseFloat(item.carat || "0")).toFixed(2),
      item.remarks || "",
    ]);

    const csvContent = [
      ["Memo No", memo.memoNo],
      ["Company", memo.company],
      ["Person", memo.person],
      ["Due Date", memo.dueDate],
      ["Amount", memo.amount],
      ["Remarks", memo.remarks || ""],
      [],
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `memo_${memo.memoNo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setMemo((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...memo.items];
    updatedItems[index][field] = value;
    setMemo((prev: any) => ({ ...prev, items: updatedItems }));
  };

  const handleSave = () => {
    if (!Array.isArray(id)) {
      const updated = [...memos];
      updated[parseInt(id)] = memo;
      saveMemos(updated);
      setMemos(updated);
      setIsEditing(false);
    }
  };

  if (!memo) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Memo Details — {memo.memoNo}
      </h1>

      <div className="overflow-x-auto bg-white border rounded shadow">
        {!isEditing ? (
          <>
            <table className="min-w-full table-auto text-sm mb-6">
              <tbody>
                {[
                  ["Company", memo.company],
                  ["Person", memo.person],
                  ["Due Date", memo.dueDate],
                  ["Amount", `₹${memo.amount}`],
                  ["Remarks", memo.remarks || "—"],
                ].map(([label, value], idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3 font-semibold bg-gray-50 w-40">
                      {label}
                    </td>
                    <td className="p-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-md font-semibold mb-2 px-1">Item Details</h2>
            <table className="w-full text-sm border mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Rate</th>
                  <th className="p-2 border">Carat</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Remarks</th>
                </tr>
              </thead>
              <tbody>
              {memo?.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="p-2 border">{item.item}</td>
                    <td className="p-2 border">₹{item.rate}</td>
                    <td className="p-2 border">{item.carat}</td>
                    <td className="p-2 border">
                      ₹
                      {(
                        parseFloat(item.rate || "0") *
                        parseFloat(item.carat || "0")
                      ).toFixed(2)}
                    </td>
                    <td className="p-2 border">{item.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <table className="min-w-full table-auto text-sm mb-6">
              <tbody>
                {["company", "person", "dueDate", "remarks"].map((field) => (
                  <tr key={field} className="border-b">
                    <td className="p-3 font-semibold bg-gray-50 w-40 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="p-3">
                      <input
                        name={field}
                        value={memo[field]}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <h2 className="text-md font-semibold mb-2 px-1">Edit Items</h2>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Item</th>
                    <th className="p-2 border">Rate</th>
                    <th className="p-2 border">Carat</th>
                    <th className="p-2 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                {memo?.items?.map((item: any, index: number) => (
                    <tr key={index}>
                      {["item", "rate", "carat", "remarks"].map((field) => (
                        <td key={field} className="p-2 border">
                          <input
                            className="w-full border p-1 rounded"
                            value={item[field]}
                            onChange={(e) =>
                              handleItemChange(index, field, e.target.value)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        )}
      </div>

      <div className="flex gap-4">
        <DownloadPDFButton memo={memo} />

        <button
          onClick={handleDownloadCSV}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Download CSV
        </button>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Memo
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        )}

        <button
          onClick={() => {
            localStorage.setItem("draft_invoice", JSON.stringify(memo));
            router.push("/invoice/new");
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Convert to Invoice
        </button>
      </div>
    </div>
  );
}
