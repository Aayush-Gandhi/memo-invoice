import { useEffect, useState } from "react";

export default function NewInvoicePage() {
  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    const draft = localStorage.getItem("draft_invoice");
    if (draft) {
      setInvoiceData(JSON.parse(draft));
    }
  }, []);

  if (!invoiceData) {
    return <p className="p-6 text-gray-500">Loading invoice draft...</p>;
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700">New Invoice from Memo #{invoiceData.memoNo}</h1>

      <div className="bg-white border rounded shadow p-4 space-y-2">
        <div><strong>Company:</strong> {invoiceData.company}</div>
        <div><strong>Person:</strong> {invoiceData.person}</div>
        <div><strong>Due Date:</strong> {invoiceData.dueDate}</div>
        <div><strong>Amount:</strong> ₹{invoiceData.amount}</div>
        <div><strong>Remarks:</strong> {invoiceData.remarks}</div>
      </div>

      <h2 className="font-semibold mt-4">Items</h2>
      <table className="w-full text-sm border">
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
          {invoiceData.items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="p-2 border">{item.item}</td>
              <td className="p-2 border">₹{item.rate}</td>
              <td className="p-2 border">{item.carat}</td>
              <td className="p-2 border">
                ₹{(parseFloat(item.rate) * parseFloat(item.carat)).toFixed(2)}
              </td>
              <td className="p-2 border">{item.remarks || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
