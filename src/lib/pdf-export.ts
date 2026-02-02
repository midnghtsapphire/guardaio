import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { HeatmapRegion } from "@/components/HeatmapOverlay";
import { MetadataPattern, ExtendedMetadata } from "./metadata-anomaly-tracker";
import { ThreatReport } from "./criminal-signature-tracker";

type AnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  heatmapRegions?: HeatmapRegion[];
  metadataPatterns?: MetadataPattern[];
  metadata?: ExtendedMetadata;
  threatReport?: ThreatReport;
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

export const exportAnalysisToPDF = async (
  result: AnalysisResult,
  fileName: string,
  fileType: string,
  fileSize: number,
  imageDataUrl?: string | null,
  sensitivity?: number
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, 40, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("AI Detection Analysis Report", pageWidth / 2, 25, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 35, { align: "center" });

  yPos = 55;

  // Status Badge
  const statusColor = getStatusColor(result.status);
  const statusText = getStatusText(result.status);
  
  pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  const statusWidth = pdf.getTextWidth(statusText) + 20;
  pdf.roundedRect((pageWidth - statusWidth) / 2, yPos, statusWidth, 12, 3, 3, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(statusText.toUpperCase(), pageWidth / 2, yPos + 8, { align: "center" });

  yPos += 25;

  // Confidence Score
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(36);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${result.confidence}%`, pageWidth / 2, yPos + 10, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 116, 139);
  pdf.text("Confidence Score", pageWidth / 2, yPos + 20, { align: "center" });

  yPos += 35;

  // File Information Table
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(15, 23, 42);
  pdf.text("File Information", 14, yPos);
  yPos += 5;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  autoTable(pdf, {
    startY: yPos,
    head: [],
    body: [
      ["File Name", fileName],
      ["File Type", fileType],
      ["File Size", formatFileSize(fileSize)],
      ["Detection Sensitivity", sensitivity !== undefined ? `${sensitivity}% (${sensitivity <= 33 ? "Low" : sensitivity <= 66 ? "Medium" : "High"})` : "50% (Medium)"],
    ],
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: "auto" },
    },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 15;

  // Image with heatmap regions visualization (if available)
  if (imageDataUrl && fileType.startsWith("image/")) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Analyzed Image", 14, yPos);
    yPos += 8;

    try {
      // Add the image
      const imgWidth = pageWidth - 28;
      const imgHeight = 80; // Fixed height for consistency
      
      pdf.addImage(imageDataUrl, "JPEG", 14, yPos, imgWidth, imgHeight, undefined, "MEDIUM");
      
      // Draw heatmap region indicators on top of image
      if (result.heatmapRegions && result.heatmapRegions.length > 0) {
        result.heatmapRegions.forEach((region, index) => {
          const regionX = 14 + (region.x / 100) * imgWidth;
          const regionY = yPos + (region.y / 100) * imgHeight;
          const regionW = (region.width / 100) * imgWidth;
          const regionH = (region.height / 100) * imgHeight;
          
          // Set color based on intensity
          const intensity = region.intensity;
          if (intensity < 0.4) {
            pdf.setDrawColor(34, 197, 94); // green
          } else if (intensity < 0.7) {
            pdf.setDrawColor(234, 179, 8); // yellow
          } else {
            pdf.setDrawColor(239, 68, 68); // red
          }
          
          pdf.setLineWidth(1);
          pdf.rect(regionX, regionY, regionW, regionH, "S");
          
          // Add region number
          pdf.setFillColor(15, 23, 42);
          pdf.circle(regionX + 4, regionY + 4, 4, "F");
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(6);
          pdf.text(String(index + 1), regionX + 4, regionY + 5.5, { align: "center" });
        });
      }
      
      yPos += imgHeight + 10;
    } catch (error) {
      console.error("Failed to add image to PDF:", error);
    }
  }

  // Check if we need a new page
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
  }

  // Heatmap Regions Table (if available)
  if (result.heatmapRegions && result.heatmapRegions.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Detection Regions", 14, yPos);
    yPos += 5;

    autoTable(pdf, {
      startY: yPos,
      head: [["#", "Region", "Intensity", "Risk Level"]],
      body: result.heatmapRegions.map((region, index) => [
        String(index + 1),
        region.label,
        `${Math.round(region.intensity * 100)}%`,
        region.intensity < 0.4 ? "Low" : region.intensity < 0.7 ? "Medium" : "High",
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
      },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 15;
  }

  // Check if we need a new page for findings
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }

  // Findings
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(15, 23, 42);
  pdf.text("AI Analysis Findings", 14, yPos);
  yPos += 5;

  autoTable(pdf, {
    startY: yPos,
    head: [["#", "Finding"]],
    body: result.findings.map((finding, index) => [String(index + 1), finding]),
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: "auto" },
    },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 20;

  // Metadata Anomalies Section
  if (result.metadataPatterns && result.metadataPatterns.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Metadata Anomaly Analysis", 14, yPos);
    yPos += 5;

    autoTable(pdf, {
      startY: yPos,
      head: [["Type", "Rarity", "Suspicious", "Details"]],
      body: result.metadataPatterns.map((pattern) => [
        pattern.type.replace(/_/g, ' ').toUpperCase(),
        `${pattern.rarity}%`,
        pattern.isSuspicious ? "⚠️ Yes" : "No",
        typeof pattern.data === 'object' ? JSON.stringify(pattern.data).substring(0, 50) : String(pattern.data),
      ]),
      theme: "striped",
      headStyles: { fillColor: [234, 179, 8] }, // yellow for metadata
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: "auto" },
      },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 15;
  }

  // Extended Metadata Section
  if (result.metadata) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("EXIF/Metadata Details", 14, yPos);
    yPos += 5;

    const metadataRows: [string, string][] = [];
    if (result.metadata.make) metadataRows.push(["Camera Make", result.metadata.make]);
    if (result.metadata.model) metadataRows.push(["Camera Model", result.metadata.model]);
    if (result.metadata.software) metadataRows.push(["Software", result.metadata.software]);
    if (result.metadata.dateTime) metadataRows.push(["Date/Time", result.metadata.dateTime]);
    if (result.metadata.width && result.metadata.height) {
      metadataRows.push(["Dimensions", `${result.metadata.width} x ${result.metadata.height}`]);
    }
    if (result.metadata.aiGenerationPrompt) {
      metadataRows.push(["AI Generation Detected", "⚠️ YES"]);
      metadataRows.push(["Prompt Preview", result.metadata.aiGenerationPrompt.substring(0, 100) + "..."]);
    }
    if (result.metadata.aiGenerationSeed) {
      metadataRows.push(["AI Seed", result.metadata.aiGenerationSeed]);
    }

    if (metadataRows.length > 0) {
      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: metadataRows,
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 45 },
          1: { cellWidth: "auto" },
        },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 15;
    }
  }

  // Threat Report Section
  if (result.threatReport && result.threatReport.signatures.length > 0) {
    if (yPos > 180) {
      pdf.addPage();
      yPos = 20;
    }

    // Threat level banner
    const threatColors: Record<string, [number, number, number]> = {
      none: [34, 197, 94],
      low: [234, 179, 8],
      medium: [249, 115, 22],
      high: [239, 68, 68],
      critical: [127, 29, 29],
    };
    
    const threatColor = threatColors[result.threatReport.overallThreatLevel] || [156, 163, 175];
    
    pdf.setFillColor(threatColor[0], threatColor[1], threatColor[2]);
    pdf.rect(14, yPos, pageWidth - 28, 20, "F");
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`⚠️ THREAT LEVEL: ${result.threatReport.overallThreatLevel.toUpperCase()}`, pageWidth / 2, yPos + 12, { align: "center" });
    
    yPos += 30;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Criminal Signature Detection", 14, yPos);
    yPos += 5;

    autoTable(pdf, {
      startY: yPos,
      head: [["Signature", "Type", "Threat Level", "Confidence"]],
      body: result.threatReport.signatures.map((ds) => [
        ds.signature.name,
        ds.signature.type.replace(/_/g, ' '),
        ds.signature.threatLevel.toUpperCase(),
        `${Math.round(ds.confidence * 100)}%`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [127, 29, 29] }, // dark red for threats
      styles: { fontSize: 9 },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 10;

    // Recommendations
    if (result.threatReport.recommendations.length > 0) {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Recommendations:", 14, yPos);
      yPos += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      result.threatReport.recommendations.forEach((rec) => {
        const lines = pdf.splitTextToSize(rec, pageWidth - 28);
        lines.forEach((line: string) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(`• ${line}`, 16, yPos);
          yPos += 5;
        });
      });
    }

    // Reporting Agencies
    if (result.threatReport.reportingAgencies.length > 0) {
      yPos += 5;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Report To:", 14, yPos);
      yPos += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      result.threatReport.reportingAgencies.forEach((agency) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${agency}`, 16, yPos);
        yPos += 5;
      });
    }
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    "This report was generated by Guardaio AI Detection Analyzer. Results are for informational purposes only.",
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  // Save the PDF
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, "_");
  pdf.save(`analysis_report_${sanitizedFileName}_${Date.now()}.pdf`);
};
