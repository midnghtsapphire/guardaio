import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { HeatmapRegion } from "@/components/HeatmapOverlay";

type AnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  heatmapRegions?: HeatmapRegion[];
};

type BatchFileResult = {
  fileName: string;
  fileType: string;
  fileSize: number;
  result?: AnalysisResult;
  error?: string;
};

const getStatusText = (status: string) => {
  switch (status) {
    case "safe": return "Authentic";
    case "warning": return "Suspicious";
    case "danger": return "Likely Fake";
    default: return "Unknown";
  }
};

const getStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case "safe": return [34, 197, 94]; // green
    case "warning": return [234, 179, 8]; // yellow
    case "danger": return [239, 68, 68]; // red
    default: return [156, 163, 175]; // gray
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export const exportBatchAnalysisToPDF = async (
  files: BatchFileResult[],
  sensitivity?: number
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 20;

  // Calculate summary statistics
  const successfulFiles = files.filter(f => f.result);
  const failedFiles = files.filter(f => f.error);
  const safeCount = successfulFiles.filter(f => f.result?.status === "safe").length;
  const warningCount = successfulFiles.filter(f => f.result?.status === "warning").length;
  const dangerCount = successfulFiles.filter(f => f.result?.status === "danger").length;
  const avgConfidence = successfulFiles.length > 0 
    ? Math.round(successfulFiles.reduce((sum, f) => sum + (f.result?.confidence || 0), 0) / successfulFiles.length)
    : 0;

  // Header
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, 45, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Batch Analysis Report", pageWidth / 2, 22, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`${files.length} files analyzed`, pageWidth / 2, 32, { align: "center" });
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 40, { align: "center" });

  yPos = 55;

  // Summary Statistics Section
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Summary Statistics", 14, yPos);
  yPos += 8;

  // Create colored stat boxes
  const boxWidth = (pageWidth - 38) / 4;
  const boxHeight = 25;
  const boxY = yPos;
  
  // Safe box
  pdf.setFillColor(220, 252, 231); // green-100
  pdf.roundedRect(14, boxY, boxWidth, boxHeight, 3, 3, "F");
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(String(safeCount), 14 + boxWidth / 2, boxY + 12, { align: "center" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Authentic", 14 + boxWidth / 2, boxY + 20, { align: "center" });

  // Warning box
  pdf.setFillColor(254, 249, 195); // yellow-100
  pdf.roundedRect(14 + boxWidth + 4, boxY, boxWidth, boxHeight, 3, 3, "F");
  pdf.setTextColor(234, 179, 8);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(String(warningCount), 14 + boxWidth + 4 + boxWidth / 2, boxY + 12, { align: "center" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Suspicious", 14 + boxWidth + 4 + boxWidth / 2, boxY + 20, { align: "center" });

  // Danger box
  pdf.setFillColor(254, 226, 226); // red-100
  pdf.roundedRect(14 + (boxWidth + 4) * 2, boxY, boxWidth, boxHeight, 3, 3, "F");
  pdf.setTextColor(239, 68, 68);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(String(dangerCount), 14 + (boxWidth + 4) * 2 + boxWidth / 2, boxY + 12, { align: "center" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Likely Fake", 14 + (boxWidth + 4) * 2 + boxWidth / 2, boxY + 20, { align: "center" });

  // Average confidence box
  pdf.setFillColor(241, 245, 249); // slate-100
  pdf.roundedRect(14 + (boxWidth + 4) * 3, boxY, boxWidth, boxHeight, 3, 3, "F");
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${avgConfidence}%`, 14 + (boxWidth + 4) * 3 + boxWidth / 2, boxY + 12, { align: "center" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Avg. Confidence", 14 + (boxWidth + 4) * 3 + boxWidth / 2, boxY + 20, { align: "center" });

  yPos = boxY + boxHeight + 15;

  // Detection sensitivity note
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(9);
  pdf.text(
    `Detection Sensitivity: ${sensitivity !== undefined ? `${sensitivity}% (${sensitivity <= 33 ? "Low" : sensitivity <= 66 ? "Medium" : "High"})` : "50% (Medium)"}`,
    14, yPos
  );
  yPos += 12;

  // Results Overview Table
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Results Overview", 14, yPos);
  yPos += 5;

  const tableBody = files.map((file, index) => {
    if (file.result) {
      return [
        String(index + 1),
        file.fileName.length > 30 ? file.fileName.substring(0, 27) + "..." : file.fileName,
        file.fileType.split("/")[1]?.toUpperCase() || file.fileType,
        formatFileSize(file.fileSize),
        getStatusText(file.result.status),
        `${file.result.confidence}%`,
      ];
    } else {
      return [
        String(index + 1),
        file.fileName.length > 30 ? file.fileName.substring(0, 27) + "..." : file.fileName,
        file.fileType.split("/")[1]?.toUpperCase() || file.fileType,
        formatFileSize(file.fileSize),
        "Error",
        "-",
      ];
    }
  });

  autoTable(pdf, {
    startY: yPos,
    head: [["#", "File Name", "Type", "Size", "Status", "Confidence"]],
    body: tableBody,
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 20 },
      3: { cellWidth: 22 },
      4: { cellWidth: 25 },
      5: { cellWidth: 22 },
    },
    didParseCell: (data) => {
      // Color the status column based on status
      if (data.section === "body" && data.column.index === 4) {
        const status = data.cell.raw as string;
        if (status === "Authentic") {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = "bold";
        } else if (status === "Suspicious") {
          data.cell.styles.textColor = [234, 179, 8];
          data.cell.styles.fontStyle = "bold";
        } else if (status === "Likely Fake") {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = "bold";
        } else if (status === "Error") {
          data.cell.styles.textColor = [156, 163, 175];
          data.cell.styles.fontStyle = "italic";
        }
      }
    },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 15;

  // Detailed findings for each file
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  
  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    yPos = 20;
  }
  
  pdf.text("Detailed Findings", 14, yPos);
  yPos += 8;

  for (const file of successfulFiles) {
    if (!file.result) continue;

    // Check if we need a new page
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 20;
    }

    const statusColor = getStatusColor(file.result.status);
    
    // File header with status badge
    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.roundedRect(14, yPos, pageWidth - 28, 18, 2, 2, "F");
    
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(file.fileName.length > 50 ? file.fileName.substring(0, 47) + "..." : file.fileName, 18, yPos + 7);
    
    // Status badge
    const statusText = getStatusText(file.result.status);
    const statusWidth = pdf.getTextWidth(statusText) + 10;
    pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.roundedRect(pageWidth - 14 - statusWidth - 30, yPos + 3, statusWidth, 12, 2, 2, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text(statusText, pageWidth - 14 - statusWidth / 2 - 30, yPos + 10, { align: "center" });
    
    // Confidence
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${file.result.confidence}%`, pageWidth - 20, yPos + 10, { align: "right" });
    
    yPos += 22;

    // Findings list
    if (file.result.findings && file.result.findings.length > 0) {
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      
      for (const finding of file.result.findings) {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.text(`• ${finding}`, 20, yPos);
        yPos += 5;
      }
    }
    
    yPos += 8;
  }

  // Failed files section (if any)
  if (failedFiles.length > 0) {
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setTextColor(239, 68, 68);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Failed Analyses", 14, yPos);
    yPos += 8;

    pdf.setTextColor(71, 85, 105);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");

    for (const file of failedFiles) {
      if (yPos > pageHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${file.fileName}: ${file.error || "Unknown error"}`, 18, yPos);
      yPos += 6;
    }
  }

  // Footer on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      "This report was generated by AI Detection Analyzer. Results are for informational purposes only.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
  }

  // Save the PDF
  pdf.save(`batch_analysis_report_${Date.now()}.pdf`);
};

// Simple batch PDF report generator
export const generateBatchPdfReport = (results: any[]) => {
  const formattedFiles: BatchFileResult[] = results.map(r => ({
    fileName: r.fileName,
    fileType: r.fileType,
    fileSize: r.fileSize,
    result: {
      status: r.status as "safe" | "warning" | "danger",
      confidence: r.confidence,
      findings: [
        ...(r.findings || []),
        ...(r.forensicFindings || []),
      ],
    },
  }));
  
  exportBatchAnalysisToPDF(formattedFiles);
};
