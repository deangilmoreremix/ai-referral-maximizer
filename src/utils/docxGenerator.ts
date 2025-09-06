import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';

// Helper function to create DOCX document with consistent styling
function createDocxDocument(title: string, companyName = 'AI Referral Maximizer') {
  const headerParagraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: companyName,
          size: 20,
          color: '666666'
        })
      ],
      alignment: AlignmentType.RIGHT
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '',
          size: 20
        })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          size: 32,
          bold: true,
          color: '235F5F'
        })
      ],
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '',
          size: 24
        })
      ]
    })
  ];

  return { headerParagraphs, contentParagraphs: [] as (Paragraph | Table)[] };
}

// Split text into paragraphs and add to DOCX with proper formatting
function addFormattedText(content: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const splitText = content.split('\n');

  for (const paragraph of splitText) {
    if (paragraph.startsWith('## ')) {
      // Heading 2
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph.replace('## ', ''),
              size: 28,
              bold: true,
              color: '235F5F'
            })
          ],
          heading: HeadingLevel.HEADING_2
        })
      );
    } else if (paragraph.startsWith('### ')) {
      // Heading 3
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph.replace('### ', ''),
              size: 24,
              bold: true,
              color: '235F5F'
            })
          ],
          heading: HeadingLevel.HEADING_3
        })
      );
    } else if (paragraph.startsWith('- ')) {
      // Bullet point
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '• ' + paragraph.replace('- ', ''),
              size: 22
            })
          ],
          indent: { left: 720 } // 0.5 inch indent
        })
      );
    } else if (paragraph.match(/^\d+\.\s/)) {
      // Numbered list
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph,
              size: 22
            })
          ],
          indent: { left: 720 }
        })
      );
    } else if (paragraph.trim() !== '') {
      // Regular paragraph with bold text support
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      const textRuns: TextRun[] = [];

      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          textRuns.push(
            new TextRun({
              text: part.replace(/\*\*/g, ''),
              bold: true,
              size: 22
            })
          );
        } else if (part.trim() !== '') {
          textRuns.push(
            new TextRun({
              text: part,
              size: 22
            })
          );
        }
      }

      paragraphs.push(
        new Paragraph({
          children: textRuns
        })
      );
    } else {
      // Empty line - add spacing
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: '' })]
        })
      );
    }
  }

  return paragraphs;
}

// Generate generic DOCX from content
function generateGenericDocx(title: string, content: string) {
  const { headerParagraphs } = createDocxDocument(title);
  const formattedParagraphs = addFormattedText(content);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [...headerParagraphs, ...formattedParagraphs]
    }]
  });

  return doc;
}

// Generate pricing sheet DOCX with tables
function generatePricingSheetDocx(title: string, content: string) {
  const { headerParagraphs } = createDocxDocument(title);
  const paragraphs: (Paragraph | Table)[] = [];

  // Process content for pricing sheet
  const sections = content.split(/(?=## )/);

  for (const section of sections) {
    if (section.trim() === '') continue;

    const lines = section.split('\n');
    let i = 0;

    // Process section title
    if (lines[i].startsWith('## ')) {
      const sectionTitle = lines[i].replace('## ', '');
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: sectionTitle,
              size: 28,
              bold: true,
              color: '235F5F'
            })
          ],
          heading: HeadingLevel.HEADING_2
        })
      );
      i++;
    }

    // Process packages
    while (i < lines.length) {
      if (lines[i].startsWith('### ')) {
        const packageTitle = lines[i].replace('### ', '');

        // Package title
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: packageTitle,
                size: 24,
                bold: true,
                color: '235F5F'
              })
            ],
            heading: HeadingLevel.HEADING_3
          })
        );
        i++;

        // Investment amount
        if (i < lines.length && lines[i].includes('**Investment:')) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: lines[i].replace(/\*\*/g, ''),
                  size: 22,
                  bold: true
                })
              ]
            })
          );
          i++;
        }

        // Package description
        if (i < lines.length && !lines[i].startsWith('-') && !lines[i].startsWith('**')) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: lines[i],
                  size: 22
                })
              ]
            })
          );
          i++;
        }

        // Deliverables as table
        let deliverables = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('**'))) {
          if (lines[i].startsWith('- ')) {
            deliverables.push(lines[i].replace('- ', ''));
          }
          i++;
        }

        if (deliverables.length > 0) {
          const table = new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: 'Deliverables', bold: true })],
                      alignment: AlignmentType.CENTER
                    })],
                    width: { size: 100, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              ...deliverables.map(item => new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(item)],
                    width: { size: 100, type: WidthType.PERCENTAGE }
                  })
                ]
              }))
            ]
          });
          paragraphs.push(table);
        }

        // Timeline
        if (i < lines.length && lines[i].includes('**Timeline:**')) {
          const timeline = lines[i].replace(/\*\*Timeline:\*\*/, '').trim();
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Timeline: ${timeline}`,
                  size: 22
                })
              ]
            })
          );
          i++;
        }

      } else {
        // Other content
        const paragraph = lines[i];
        if (paragraph.trim() !== '') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph,
                  size: 22
                })
              ]
            })
          );
        }
        i++;
      }
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: [...headerParagraphs, ...paragraphs]
    }]
  });

  return doc;
}

// Main function to generate appropriate DOCX based on document type
export async function generateDocx(title: string, contentType: string, content: string): Promise<Buffer> {
  let doc: Document;

  switch (contentType) {
    case 'Comprehensive Pricing Sheets':
      doc = generatePricingSheetDocx(title, content);
      break;
    default:
      doc = generateGenericDocx(title, content);
      break;
  }

  // Generate and return the DOCX file as buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

// Helper function to download DOCX file
export function downloadDocx(buffer: Buffer, filename: string) {
  // Convert Buffer to Uint8Array for browser compatibility
  const uint8Array = new Uint8Array(buffer);
  const blob = new Blob([uint8Array], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}