import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx"
import type { ProposalContent } from "@/lib/types"

export async function generateDOCX(
  content: ProposalContent,
  options: {
    title: string
    companyName: string
    clientName: string
  }
): Promise<Blob> {
  const children: Paragraph[] = []

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: options.title,
          bold: true,
          size: 48,
          color: "1e3a5f",
        }),
      ],
      spacing: { after: 200 },
    })
  )

  // Subtitle
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${options.companyName} | Prepared for ${options.clientName}`,
          size: 24,
          color: "64748b",
        }),
      ],
      spacing: { after: 400 },
      border: {
        bottom: {
          color: "1e3a5f",
          space: 8,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    })
  )

  // Sections
  for (const section of content.sections) {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    )

    // Split content by newlines and create paragraphs
    const paragraphs = section.content.split("\n").filter((p) => p.trim())
    for (const para of paragraphs) {
      // Strip basic HTML tags for DOCX
      const cleanText = para.replace(/<[^>]*>/g, "").trim()
      if (cleanText) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: cleanText, size: 22 })],
            spacing: { after: 120 },
          })
        )
      }
    }
  }

  // Footer
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Prepared by ${options.companyName} | Generated with BILLIT`,
          size: 18,
          color: "94a3b8",
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
      border: {
        top: {
          color: "e2e8f0",
          space: 8,
          style: BorderStyle.SINGLE,
          size: 2,
        },
      },
    })
  )

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  return await Packer.toBlob(doc)
}
