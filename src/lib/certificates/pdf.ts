import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface CertificateRenderInput {
  certificateCode: string;
  recipientName: string;
  programTitle: string;
  issuedAtIso: string;
}

/**
 * Pure-JS serverless PDF certificate generator using `pdf-lib`.
 * Requires zero Chromium/Puppeteer native binaries cleanly fitting Vercel limits.
 */
export async function generateCertificatePdfBytes(
  input: CertificateRenderInput
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Dark midnight header band matching official brand identity
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: rgb(7 / 255, 13 / 255, 25 / 255),
  });

  // Outer hairline frame
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: rgb(29 / 255, 78 / 255, 216 / 255),
    borderWidth: 1.5,
  });

  page.drawText("TECH GROWW", {
    x: 56,
    y: height - 58,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("TECHNOLOGY THAT DRIVES GROWTH", {
    x: 56,
    y: height - 82,
    size: 10,
    font: fontRegular,
    color: rgb(148 / 255, 163 / 255, 184 / 255),
  });

  page.drawText("CERTIFICATE OF INTERNSHIP COMPLETION", {
    x: 56,
    y: height - 180,
    size: 20,
    font: fontBold,
    color: rgb(7 / 255, 13 / 255, 25 / 255),
  });

  page.drawText("This verifies that", {
    x: 56,
    y: height - 230,
    size: 13,
    font: fontRegular,
    color: rgb(82 / 255, 96 / 255, 117 / 255),
  });

  page.drawText(input.recipientName, {
    x: 56,
    y: height - 274,
    size: 30,
    font: fontBold,
    color: rgb(29 / 255, 78 / 255, 216 / 255),
  });

  page.drawText(
    `has successfully completed the structured Tech Groww cohort program:`,
    {
      x: 56,
      y: height - 320,
      size: 13,
      font: fontRegular,
      color: rgb(7 / 255, 13 / 255, 25 / 255),
    }
  );

  page.drawText(input.programTitle, {
    x: 56,
    y: height - 352,
    size: 18,
    font: fontBold,
    color: rgb(7 / 255, 13 / 255, 25 / 255),
  });

  page.drawText(`Issued Date: ${input.issuedAtIso.slice(0, 10)}`, {
    x: 56,
    y: 80,
    size: 11,
    font: fontRegular,
    color: rgb(82 / 255, 96 / 255, 117 / 255),
  });

  page.drawText(`Verification Code: ${input.certificateCode}`, {
    x: 56,
    y: 58,
    size: 11,
    font: fontBold,
    color: rgb(7 / 255, 13 / 255, 25 / 255),
  });

  page.drawText("Verify online: https://techgroww.co.in/api/v1/public/certificates/" + input.certificateCode, {
    x: 340,
    y: 58,
    size: 9.5,
    font: fontRegular,
    color: rgb(82 / 255, 96 / 255, 117 / 255),
  });

  return pdfDoc.save();
}
