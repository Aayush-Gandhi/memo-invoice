import jsPDF from "jspdf";

type Props = {
  data: any[];
  type: "memo" | "invoice";
  format: "csv" | "pdf";
};

export default function DownloadButton({ data, type, format }: Props) {
  const handleDownload = () => {
    if (format === "csv") downloadCSV();
    else if (format === "pdf") downloadPDF();
  };

  const downloadCSV = () => {
    if (!data.length) return;
  
    // Flatten each item row into a CSV line
    const rows: string[] = [];
  
    // Header
    const headers = [
      "Memo No",
      "Company",
      "Person",
      "Due Date",
      "Item",
      "Rate",
      "Carat",
      "Amount",
      "Remarks"
    ];
    rows.push(headers.join(","));
  
    // Each memo might have multiple items
    data.forEach((memo) => {
      memo.items.forEach((item: any) => {
        const amount = (
          parseFloat(item.rate || "0") * parseFloat(item.carat || "0")
        ).toFixed(2);
  
        const row = [
          memo.memoNo,
          memo.company,
          memo.person,
          memo.dueDate,
          item.item,
          item.rate,
          item.carat,
          amount,
          item.remarks || ""
        ];
        rows.push(row.join(","));
      });
    });
  
    // Create & download blob
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}_report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  

  const downloadPDF = () => {
    const doc = new jsPDF();
    const leftX = 20;
  
    doc.setFontSize(16);
    doc.text(`${type.toUpperCase()} REPORT`, leftX, 20);
    doc.setFontSize(12);
  
    data.forEach((entry, index) => {
      const startY = 30 + index * 100;
  
      doc.setFont("helvetica", "bold");
      doc.text(`${type === "invoice" ? "Invoice No" : "Memo No"}:`, leftX, startY);
      doc.text("Company:", leftX, startY + 8);
      doc.text("Person:", leftX, startY + 16);
      doc.text("Due Date:", leftX, startY + 24);
      doc.text("Total Amount:", leftX, startY + 32);
  
      doc.setFont("helvetica", "normal");
      doc.text(entry.memoNo, leftX + 40, startY);
      doc.text(entry.company, leftX + 40, startY + 8);
      doc.text(entry.person, leftX + 40, startY + 16);
      doc.text(entry.dueDate, leftX + 40, startY + 24);
      doc.text(`₹${entry.amount}`, leftX + 40, startY + 32);
  
      doc.setFont("helvetica", "bold");
      doc.text("Items", leftX, startY + 44);
      doc.setFont("helvetica", "normal");
  
      entry.items.forEach((item: any, i: number) => {
        const y = startY + 52 + i * 8;
        doc.text(
          `• ${item.item} | ₹${item.rate} x ${item.carat}ct = ₹${(
            parseFloat(item.rate || "0") * parseFloat(item.carat || "0")
          ).toFixed(2)}${item.remarks ? ` | ${item.remarks}` : ""}`,
          leftX + 4,
          y
        );
      });
  
      // Divider
      doc.line(leftX, startY + 60 + entry.items.length * 8, 190, startY + 60 + entry.items.length * 8);
    });
  
    doc.save(`${type}_report.pdf`);
  };
  

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Download {type.toUpperCase()} as {format.toUpperCase()}
    </button>
  );
}
