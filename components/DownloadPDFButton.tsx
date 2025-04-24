import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY_INFO } from "../utils/constants";

export default function DownloadPDFButton({ memo }: { memo: any }) {
  const handleDownloadPDF = () => {
    if (!memo) return;

    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(16);
    doc.text("MEMO", 105, y, { align: "center" });
    y += 10;

    // Company Info
    const CURRENCY = "$";

    doc.setFontSize(10);
    doc.text(`Company: ${COMPANY_INFO.name}`, 10, y);
    y += 6;
    doc.text(`Address: ${COMPANY_INFO.addressLine1}`, 10, y);
    y += 6;
    doc.text(`${COMPANY_INFO.addressLine2}`, 10, y);
    y += 6;
    doc.text(`Contact: ${COMPANY_INFO.email} | ${COMPANY_INFO.phone}`, 10, y);
    y += 6;
    doc.text(`Attn: ${COMPANY_INFO.attention}`, 10, y);
    y += 10;

    // Memo Info
    doc.setFontSize(10);
    doc.text(`Memo No: ${memo.memoNo}`, 150, 20);
    doc.text(`Memo Date: ${memo.dueDate}`, 150, 26);

    // Bill/Ship
    doc.setFontSize(11);
    doc.text("Bill To:", 10, y);
    doc.text(memo.company, 20, y + 6);
    doc.text("Ship To:", 110, y);
    doc.text(memo.company, 120, y + 6);
    y += 16;

    // Items Table
    const itemRows = (memo?.items || []).map((item: any) => [
      item.item,
      `${CURRENCY} ${item.rate}`,
      item.carat,
      `${CURRENCY} ${(
        parseFloat(item.rate || "0") * parseFloat(item.carat || "0")
      ).toFixed(2)}`,

      item.remarks || "—",
    ]);

    autoTable(doc, {
      head: [["Item", "Rate", "Carat", "Amount", "Remarks"]],
      body: itemRows,
      startY: y,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || y + 30;

    // Totals
    const totalCarat =
      memo.items?.reduce(
        (sum: number, item: any) => sum + parseFloat(item.carat || "0"),
        0
      ) || 0;

    const totalAmount =
      memo.items?.reduce(
        (sum: number, item: any) =>
          sum + parseFloat(item.rate || "0") * parseFloat(item.carat || "0"),
        0
      ) || 0;

    doc.setFontSize(11);
    doc.text(`Total Carat: ${totalCarat.toFixed(2)}`, 10, finalY + 10);
    doc.text(
      `Total Amount: ${CURRENCY} ${totalAmount.toFixed(2)}`,
      10,
      finalY + 16
    );

    // Terms & Conditions
    doc.setFontSize(9);
    doc.text("Terms & Conditions:", 10, finalY + 26);
    doc.text(
      "Goods sold are subject to approval & remain property until paid.",
      10,
      finalY + 31
    );
    doc.text("All disputes subject to local jurisdiction.", 10, finalY + 36);

    // Footer
    doc.text(`© ${COMPANY_INFO.name}`, 150, 290);

    doc.save(`memo_${memo.memoNo || "unknown"}.pdf`);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Download PDF
    </button>
  );
}
