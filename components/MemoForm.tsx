import { useState, useEffect } from "react";


export default function MemoForm({
  onAdd,
  initialData,
}: {
  onAdd: (memo: any) => void;
  initialData: any;
}) {
  const [form, setForm] = useState({
    memoNo: "",
    company: "",
    person: "",
    dueDate: "",
    remarks: "",
    items: [{ item: "", rate: "", carat: "", remarks: "" }],
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      const last = localStorage.getItem("memo_counter") || "1";
      const next = (parseInt(last) + 1).toString().padStart(3, "0");
      setForm((f) => ({ ...f, memoNo: next }));
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { item: "", rate: "", carat: "", remarks: "" }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const calculateTotal = () =>
    form.items.reduce((sum, row) => {
      const amount = parseFloat(row.rate || "0") * parseFloat(row.carat || "0");
      return sum + amount;
    }, 0);

    const handleSubmit = (e: any) => {
      e.preventDefault();
      const totalAmount = calculateTotal().toFixed(2);
      onAdd({ ...form, amount: totalAmount });
      localStorage.setItem(
        "memo_counter",
        (parseInt(form.memoNo) || 0).toString()
      );
      setForm({
        memoNo: "",
        company: "",
        person: "",
        dueDate: "",
        remarks: "",
        items: [{ item: "", rate: "", carat: "", remarks: "" }],
      });
    };
    

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="memoNo"
          value={form.memoNo}
          readOnly
          className="bg-gray-100 p-2 rounded border"
          placeholder="Memo No"
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
          className="p-2 rounded border"
          placeholder="Company Name *"
        />
        <input
          name="person"
          value={form.person}
          onChange={handleChange}
          className="p-2 rounded border"
          placeholder="Person Name"
        />
        <input
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="p-2 rounded border"
          type="date"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Carat</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {form.items.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td>
                  <input
                    value={row.item}
                    onChange={(e) =>
                      handleItemChange(idx, "item", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Item"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleItemChange(idx, "rate", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Rate"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.carat}
                    onChange={(e) =>
                      handleItemChange(idx, "carat", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Carat"
                  />
                </td>
                <td className="p-2 text-center">
                  {(
                    parseFloat(row.rate || "0") * parseFloat(row.carat || "0")
                  ).toFixed(2)}
                </td>
                <td>
                  <input
                    value={row.remarks || ""}
                    onChange={(e) =>
                      handleItemChange(idx, "remarks", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Remarks"
                  />
                </td>
                <td className="p-2 text-center">
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={handleAddItem}
          className="mt-3 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          + Add Item
        </button>

        <div className="text-right font-semibold mt-3">
          Total Amount: ₹ {calculateTotal().toFixed(2)}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {initialData ? "Update Memo" : "Add Memo"}
      </button>
    </form>
  );
}
