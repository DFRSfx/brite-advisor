import PDFDocument from "pdfkit";
import type { Response } from "express";
import type { Assessment } from "./db.js";

const QUADRANT_LABELS: Record<string, string> = {
  Q1: "Basic — Linear ecosystem, batch sync",
  Q2: "Agility — Linear ecosystem, real-time sync",
  Q3: "Legacy — Distributed ecosystem, batch sync",
  Q4: "State of the Art — Distributed ecosystem, real-time sync",
};

const QUADRANT_TECH: Record<string, string> = {
  Q1: "CSV files, Point-to-Point integrations",
  Q2: "REST APIs, managed iPaaS",
  Q3: "ESB/EDI, monolithic ERP",
  Q4: "Kafka, microservices, event-driven architecture",
};

export function streamAssessmentPdf(assessment: Assessment, res: Response): void {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="brite-diagnosis-${assessment.id}.pdf"`
  );
  doc.pipe(res);

  // Header
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("BRITE Framework Diagnosis", { align: "center" });

  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#666666")
    .text(`Generated: ${new Date(assessment.created_at).toLocaleDateString()}`, {
      align: "center",
    });

  doc.moveDown(1.5);

  // Company section
  section(doc, "Company Profile");
  row(doc, "Company", assessment.company_name);
  row(doc, "Industry", assessment.industry);
  row(doc, "Business Model", assessment.business_model);
  row(doc, "Company Size", assessment.company_size);

  doc.moveDown(1);

  // Diagnosis result
  section(doc, "BRITE Classification");
  row(doc, "Quadrant", `${assessment.quadrant} — ${QUADRANT_LABELS[assessment.quadrant] ?? ""}`);
  row(doc, "Ecosystem Score (Eixo X)", `${assessment.ecosystem_score.toFixed(1)} / 10`);
  row(doc, "Sync Score (Eixo Y)", `${assessment.sync_score.toFixed(1)} / 10`);
  row(doc, "Recommended Stack", QUADRANT_TECH[assessment.quadrant] ?? "");

  doc.moveDown(1);

  // Inputs
  section(doc, "Assessment Inputs");
  const fd = assessment.form_data;
  row(doc, "Sales Channels", String(fd.numberOfChannels));
  row(doc, "External Integrations", String(fd.numberOfIntegrations));
  row(doc, "Omnichannel Presence", fd.hasOmnichannelPresence ? "Yes" : "No");
  row(doc, "External Partners", fd.hasExternalPartners ? "Yes" : "No");
  row(doc, "Tolerates Latency", fd.toleratesLatency ? "Yes" : "No");
  row(doc, "Real-Time Inventory", fd.needsRealTimeInventory ? "Yes" : "No");
  row(doc, "Real-Time Personalization", fd.needsRealTimePersonalization ? "Yes" : "No");
  row(doc, "Mission-Critical Transactions", fd.hasMissionCriticalTransactions ? "Yes" : "No");

  doc.moveDown(1);

  // AI analysis — strip markdown
  if (assessment.ai_analysis) {
    section(doc, "AI Architecture Diagnosis");
    const plain = assessment.ai_analysis
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\|.*\|/g, "")
      .replace(/[-]{3,}/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    doc.fontSize(10).font("Helvetica").fillColor("#111111").text(plain, {
      lineGap: 4,
      paragraphGap: 6,
    });
  }

  doc.end();
}

function section(doc: PDFKit.PDFDocument, title: string): void {
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#111111")
    .text(title);
  doc
    .moveTo(50, doc.y + 2)
    .lineTo(545, doc.y + 2)
    .strokeColor("#cccccc")
    .stroke();
  doc.moveDown(0.5);
}

function row(doc: PDFKit.PDFDocument, label: string, value: string): void {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#444444")
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .fillColor("#111111")
    .text(value);
}
