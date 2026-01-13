import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY_INFO } from "../utils/constants";

export default function DownloadPDFButton({ memo }: { memo: any }) {
  const handleDownloadPDF = () => {
    if (!memo) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 10;
    const textWidth = pageWidth - marginX * 2;

    let y = 20;

    // =====================
    // Title
    // =====================
    doc.setFontSize(16);
    doc.text("MEMO", pageWidth / 2, y, { align: "center" });
    y += 10;

    // =====================
    // Company Info
    // =====================
    const CURRENCY = "$";

    doc.setFontSize(10);
    doc.text(`Company: ${COMPANY_INFO.name}`, marginX, y);
    y += 6;
    doc.text(`Address: ${COMPANY_INFO.addressLine1}`, marginX, y);
    y += 6;
    doc.text(`${COMPANY_INFO.addressLine2}`, marginX, y);
    y += 6;
    doc.text(
      `Contact: ${COMPANY_INFO.email} | ${COMPANY_INFO.phone}`,
      marginX,
      y
    );
    y += 6;
    doc.text(`Attn: ${COMPANY_INFO.attention}`, marginX, y);
    y += 10;

    // =====================
    // Memo Info
    // =====================
    doc.setFontSize(10);
    doc.text(`Memo No: ${memo.memoNo}`, pageWidth - 60, 20);
    doc.text(`Memo Date: ${memo.dueDate}`, pageWidth - 60, 26);

    // =====================
    // Bill / Ship
    // =====================
    doc.setFontSize(11);
    doc.text("Bill To:", marginX, y);
    doc.text(memo.company, marginX + 10, y + 6);

    doc.text("Ship To:", pageWidth / 2 + 10, y);
    doc.text(memo.company, pageWidth / 2 + 20, y + 6);

    y += 16;

    // =====================
    // Items Table
    // =====================
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

    // =====================
    // Totals
    // =====================
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
    doc.text(`Total Carat: ${totalCarat.toFixed(2)}`, marginX, finalY + 10);
    doc.text(
      `Total Amount: ${CURRENCY} ${totalAmount.toFixed(2)}`,
      marginX,
      finalY + 16
    );

    // =====================
    // Terms & Conditions
    // =====================
    doc.setFontSize(9);

    const termsTitleY = finalY + 26;
    doc.text("Terms & Conditions:", marginX, termsTitleY);

    const terms1 =
      "Goods sold are subject to approval and remain property until paid. The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and in compliance with United Nations resolutions. The seller hereby guarantees that these diamonds are conflict-free based on personal knowledge and/or written guarantees provided by the supplier of these diamonds.";

    const terms2 =
      "The goods described and valued above are delivered to you by ROYALTY JEWELS LLC. The buyer, that is the company, has purchased the above-described goods and is liable to make payment for the same on or before the payment due date. Interest at 2.5% per month will be charged if not paid within the due date. By receipt of the above goods, the buyer acknowledges that the goods purchased are fully represented and disclosed as laboratory-grown.";

    const lines1 = doc.splitTextToSize(terms1, textWidth);
    doc.text(lines1, marginX, termsTitleY + 5, {
      maxWidth: textWidth,
      align: "justify",
    });

    const nextY = termsTitleY + 5 + lines1.length * 4;

    const lines2 = doc.splitTextToSize(terms2, textWidth);
    doc.text(lines2, marginX, nextY + 4, {
      maxWidth: textWidth,
      align: "justify",
    });

    // =====================
    // Footer
    // =====================
    doc.setFontSize(9);
    doc.text(`© ${COMPANY_INFO.name}`, pageWidth - 60, pageHeight - 10);

    // =====================
    // Save
    // =====================
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
