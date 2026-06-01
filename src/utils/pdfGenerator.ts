import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

// Helper function to fetch image and convert to base64
export async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image as base64:', error);
    throw error;
  }
}

// Helper function to add images to PDF
export async function addImagesToPdf(
  doc: jsPDF,
  imageUrls: string[],
  startY: number,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    columns?: number;
  }
): Promise<number> {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const maxWidth = options?.maxWidth || (pageWidth - 2 * margin) / 2;
  const maxHeight = options?.maxHeight || 60;
  const columns = options?.columns || 2;

  let currentY = startY;

  for (let i = 0; i < imageUrls.length; i += columns) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    const rowImages = imageUrls.slice(i, i + columns);
    const cellWidth = (pageWidth - 2 * margin) / columns;

    for (let j = 0; j < rowImages.length; j++) {
      try {
        const base64Image = await fetchImageAsBase64(rowImages[j]);
        const x = margin + j * cellWidth + (cellWidth - maxWidth) / 2;
        doc.addImage(base64Image, 'PNG', x, currentY, maxWidth, maxHeight);
      } catch (error) {
        console.warn(`Failed to add image ${rowImages[j]}:`, error);
      }
    }

    currentY += maxHeight + 10;
  }

  return currentY;
}

// Helper function to create PDF document with consistent styling
function createPdf(title: string, companyName = 'Rebranding Services') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add header with company name
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(companyName, 20, 15);
  doc.setDrawColor(60, 60, 255);
  doc.line(20, 17, 190, 17);
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(35, 95, 175);
  const titleWidth = doc.getStringUnitWidth(title) * 24 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(title, titleX, 30);
  
  // Add footer with page number
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages}`,
      doc.internal.pageSize.width / 2, 
      doc.internal.pageSize.height - 10, 
      { align: 'center' }
    );
    doc.text(
      `© ${new Date().getFullYear()} ${companyName}`,
      doc.internal.pageSize.width - 20, 
      doc.internal.pageSize.height - 10, 
      { align: 'right' }
    );
  }
  
  return doc;
}

// Split text into paragraphs and add to PDF with proper formatting
function addFormattedText(doc: jsPDF, text: string, startY: number) {
  const splitText = text.split('\n');
  let currentY = startY;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const textWidth = pageWidth - 2 * margin;
  
  for (const paragraph of splitText) {
    if (paragraph.startsWith('## ')) {
      // Heading 2
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(18);
      doc.setTextColor(35, 95, 175);
      doc.setFont('helvetica', 'bold');
      const heading = paragraph.replace('## ', '');
      doc.text(heading, margin, currentY);
      currentY += 8;
    } else if (paragraph.startsWith('### ')) {
      // Heading 3
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(15);
      doc.setTextColor(35, 95, 175);
      doc.setFont('helvetica', 'bold');
      const heading = paragraph.replace('### ', '');
      doc.text(heading, margin, currentY);
      currentY += 6;
    } else if (paragraph.startsWith('- ')) {
      // Bullet point
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const bulletText = paragraph.replace('- ', '');
      doc.text('•', margin, currentY);
      const lines = doc.splitTextToSize(bulletText, textWidth - 5);
      doc.text(lines, margin + 5, currentY);
      currentY += 6 * lines.length;
    } else if (paragraph.match(/^\d+\.\s/)) {
      // Numbered list
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const numberMatch = paragraph.match(/^(\d+)\.\s(.*)/);
      if (numberMatch) {
        const [, number, text] = numberMatch;
        doc.text(`${number}.`, margin, currentY);
        const lines = doc.splitTextToSize(text, textWidth - 10);
        doc.text(lines, margin + 10, currentY);
        currentY += 6 * lines.length;
      }
    } else if (paragraph.trim() !== '') {
      // Regular paragraph
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      // Handle bold text with **text**
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      let xOffset = margin;
      
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          doc.setFont('helvetica', 'bold');
          const boldText = part.replace(/\*\*/g, '');
          doc.text(boldText, xOffset, currentY);
          xOffset += doc.getStringUnitWidth(boldText) * 12 / doc.internal.scaleFactor;
          doc.setFont('helvetica', 'normal');
        } else if (part.trim() !== '') {
          const lines = doc.splitTextToSize(part, textWidth - (xOffset - margin));
          
          if (xOffset > margin) {
            // If we're continuing on the same line
            doc.text(lines[0], xOffset, currentY);
            xOffset += doc.getStringUnitWidth(lines[0]) * 12 / doc.internal.scaleFactor;
            
            if (lines.length > 1) {
              currentY += 6;
              for (let i = 1; i < lines.length; i++) {
                doc.text(lines[i], margin, currentY);
                currentY += 6;
              }
              xOffset = margin;
            }
          } else {
            // Starting a new paragraph
            doc.text(lines, margin, currentY);
            currentY += 6 * lines.length;
          }
        }
      }
      
      if (xOffset > margin) {
        currentY += 6; // End of mixed formatting paragraph
      }
    } else {
      // Empty line - add spacing
      currentY += 4;
    }
  }
  
  return currentY;
}

// Generate brochure PDF from markdown content
function generateBrochurePdf(title: string, content: string) {
  const doc = createPdf(title);
  const startY = 40;
  
  addFormattedText(doc, content, startY);
  
  // Add contact info at the end
  const lastPage = doc.internal.getNumberOfPages();
  doc.setPage(lastPage);
  doc.setFontSize(12);
  doc.setTextColor(35, 95, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact Us', 20, doc.internal.pageSize.height - 40);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Email: contact@rebrandingservices.com', 20, doc.internal.pageSize.height - 35);
  doc.text('Phone: (555) 123-4567', 20, doc.internal.pageSize.height - 30);
  doc.text('Website: www.rebrandingservices.com', 20, doc.internal.pageSize.height - 25);
  
  return doc;
}

// Generate pricing sheet with tables
function generatePricingSheet(title: string, content: string) {
  const doc = createPdf(title);
  let startY = 40;
  
  // Process content for pricing sheet (extract tables, etc.)
  const sections = content.split(/(?=## )/);
  
  for (const section of sections) {
    if (section.trim() === '') continue;
    
    const lines = section.split('\n');
    let i = 0;
    
    // Process section title
    if (lines[i].startsWith('## ')) {
      const sectionTitle = lines[i].replace('## ', '');
      doc.setFontSize(18);
      doc.setTextColor(35, 95, 175);
      doc.setFont('helvetica', 'bold');
      doc.text(sectionTitle, 20, startY);
      startY += 10;
      i++;
    }
    
    // Process packages
    while (i < lines.length) {
      if (lines[i].startsWith('### ')) {
        const packageTitle = lines[i].replace('### ', '');
        
        // Create a new page if needed
        if (startY > 240) {
          doc.addPage();
          startY = 20;
        }
        
        // Package title
        doc.setFontSize(15);
        doc.setTextColor(35, 95, 175);
        doc.setFont('helvetica', 'bold');
        doc.text(packageTitle, 20, startY);
        startY += 8;
        i++;
        
        // Investment amount (if next line has it)
        if (i < lines.length && lines[i].includes('**Investment:')) {
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.text(lines[i].replace(/\*\*/g, ''), 20, startY);
          startY += 8;
          i++;
        }
        
        // Package description
        if (i < lines.length && !lines[i].startsWith('-') && !lines[i].startsWith('**')) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          const descLines = doc.splitTextToSize(lines[i], 170);
          doc.text(descLines, 20, startY);
          startY += 6 * descLines.length + 2;
          i++;
        }
        
        // Deliverables
        let deliverables = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('**'))) {
          if (lines[i].startsWith('**')) {
            // Section header
            if (deliverables.length > 0) {
              // Create table with collected deliverables
              autoTable(doc, {
                startY,
                head: [['Deliverables']],
                body: deliverables.map(item => [item]),
                theme: 'grid',
                headStyles: {
                  fillColor: [60, 90, 190],
                  textColor: 255,
                  fontStyle: 'bold',
                  halign: 'left'
                },
                margin: { left: 20, right: 20 },
                styles: {
                  overflow: 'linebreak',
                  cellWidth: 'auto',
                },
              });
              startY = (doc as any).lastAutoTable.finalY + 10;
              deliverables = [];
            }
            
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text(lines[i].replace(/\*\*/g, ''), 20, startY);
            startY += 6;
          } else if (lines[i].startsWith('- ')) {
            // Add to deliverables list
            deliverables.push(lines[i].replace('- ', ''));
          }
          i++;
        }
        
        // Create final deliverables table
        if (deliverables.length > 0) {
          autoTable(doc, {
            startY,
            head: [['Deliverables']],
            body: deliverables.map(item => [item]),
            theme: 'grid',
            headStyles: {
              fillColor: [60, 90, 190],
              textColor: 255,
              fontStyle: 'bold',
              halign: 'left'
            },
            margin: { left: 20, right: 20 },
            styles: {
              overflow: 'linebreak',
              cellWidth: 'auto',
            },
          });
          startY = (doc as any).lastAutoTable.finalY + 10;
        }
        
        // Timeline
        if (i < lines.length && lines[i].includes('**Timeline:**')) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          const timeline = lines[i].replace(/\*\*Timeline:\*\*/, '').trim();
          doc.text(`Timeline: ${timeline}`, 20, startY);
          startY += 10;
          i++;
        }
        
      } else {
        // Other content
        const paragraph = lines[i];
        if (paragraph.trim() !== '') {
          // Create a new page if needed
          if (startY > 270) {
            doc.addPage();
            startY = 20;
          }
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          const descLines = doc.splitTextToSize(paragraph, 170);
          doc.text(descLines, 20, startY);
          startY += 6 * descLines.length;
        }
        i++;
      }
    }
  }
  
  return doc;
}

// Generate case study PDF
function generateCaseStudyPdf(title: string, content: string) {
  const doc = createPdf(title);
  let startY = 40;
  
  // Process the case study content
  const sections = content.split(/(?=## )/);
  
  for (const section of sections) {
    if (section.trim() === '') continue;
    
    const lines = section.split('\n');
    let i = 0;
    
    // Process section title
    if (lines[i].startsWith('## ')) {
      // Create table for case study header
      const caseStudyTitle = lines[i].replace('## ', '');
      
      autoTable(doc, {
        startY: startY,
        head: [[caseStudyTitle]],
        body: [],
        theme: 'plain',
        headStyles: {
          fillColor: [60, 90, 190],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 16,
          cellPadding: 10,
        },
        margin: { left: 20, right: 20 },
      });
      
      startY = (doc as any).lastAutoTable.finalY + 10;
      i++;
    }
    
    // Process case study sections
    while (i < lines.length) {
      if (lines[i].startsWith('### ')) {
        const sectionTitle = lines[i].replace('### ', '');
        
        // Create a new page if needed
        if (startY > 250) {
          doc.addPage();
          startY = 20;
        }
        
        // Section box with colored background
        autoTable(doc, {
          startY: startY,
          head: [[sectionTitle]],
          body: [],
          theme: 'plain',
          headStyles: {
            fillColor: [240, 240, 250],
            textColor: [35, 95, 175],
            fontStyle: 'bold',
            fontSize: 14,
            cellPadding: 5,
          },
          margin: { left: 20, right: 20 },
        });
        
        startY = (doc as any).lastAutoTable.finalY + 5;
        i++;
        
        // Collect content for this section
        let sectionContent = [];
        while (i < lines.length && !lines[i].startsWith('### ') && !lines[i].startsWith('## ')) {
          if (lines[i].trim() !== '') {
            if (lines[i].startsWith('- ')) {
              // Bullet points
              sectionContent.push('• ' + lines[i].substring(2));
            } else {
              sectionContent.push(lines[i]);
            }
          }
          i++;
        }
        
        // Add section content
        if (sectionContent.length > 0) {
          // Results section might need special formatting
          if (sectionTitle === 'Results') {
            // Create bullet points for results
            const resultPoints = sectionContent.filter(line => line.startsWith('- ') || line.startsWith('• '));
            
            if (resultPoints.length > 0) {
              autoTable(doc, {
                startY: startY,
                body: resultPoints.map(point => [point]),
                theme: 'plain',
                styles: {
                  overflow: 'linebreak',
                  cellWidth: 'auto',
                  cellPadding: 4,
                  fontSize: 11,
                },
                margin: { left: 25, right: 20 },
              });
              
              startY = (doc as any).lastAutoTable.finalY + 5;
            }
            
            // Regular paragraphs
            const paragraphs = sectionContent.filter(line => !line.startsWith('- ') && !line.startsWith('• '));
            if (paragraphs.length > 0) {
              const text = paragraphs.join('\n\n');
              const textLines = doc.splitTextToSize(text, 170);
              
              doc.setFontSize(11);
              doc.setTextColor(0, 0, 0);
              doc.text(textLines, 20, startY);
              startY += 6 * textLines.length;
            }
          } else {
            // Other sections - standard text
            const text = sectionContent.join('\n\n');
            const textLines = doc.splitTextToSize(text, 170);
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(textLines, 20, startY);
            startY += 6 * textLines.length + 5;
          }
        }
      } else {
        i++; // Skip other lines
      }
    }
  }
  
  return doc;
}

// Generic function to handle other document types
function generateGenericPdf(title: string, content: string) {
  const doc = createPdf(title);
  const startY = 40;
  
  addFormattedText(doc, content, startY);
  
  return doc;
}

// Main function to generate appropriate PDF based on document type
export function generatePdf(title: string, contentType: string, content: string) {
  switch (contentType) {
    case 'Service Brochures':
      return generateBrochurePdf(title, content);
    case 'Comprehensive Pricing Sheets':
      return generatePricingSheet(title, content);
    case 'Detailed Case Studies':
      return generateCaseStudyPdf(title, content);
    default:
      return generateGenericPdf(title, content);
  }
}