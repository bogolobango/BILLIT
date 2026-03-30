import type { ProposalContent } from "@/lib/types"

export async function generatePDF(
  content: ProposalContent,
  options: {
    title: string
    companyName: string
    clientName: string
    primaryColor?: string
    logoUrl?: string | null
  }
): Promise<Blob> {
  // For MVP, generate a simple HTML-based PDF using the browser's print API
  // In production, use @react-pdf/renderer or a server-side PDF library

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
        .header { border-bottom: 3px solid ${options.primaryColor || "#1e3a5f"}; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 28px; color: ${options.primaryColor || "#1e3a5f"}; margin: 0; }
        .header .meta { color: #64748b; font-size: 14px; margin-top: 8px; }
        h2 { color: ${options.primaryColor || "#1e3a5f"}; font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 32px; }
        p { margin: 8px 0; font-size: 14px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${options.title}</h1>
        <div class="meta">
          <strong>${options.companyName}</strong> | Prepared for ${options.clientName}
        </div>
      </div>
      ${content.sections
        .map(
          (section) => `
        <h2>${section.title}</h2>
        <div>${section.content}</div>
      `
        )
        .join("")}
      <div class="footer">
        Prepared by ${options.companyName} | Generated with BILLIT
      </div>
    </body>
    </html>
  `

  // Create blob from HTML (in production, use proper PDF generation)
  return new Blob([html], { type: "text/html" })
}
