/**
 * Enhanced PDF Export Utilities
 * Provides high-quality PDF generation with proper formatting
 */

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface PDFExportOptions {
  filename?: string
  quality?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  margin?: number
  scale?: number
}

/**
 * Enhanced PDF export using html2canvas + jsPDF with optimized settings
 */
export async function exportToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'cv.pdf',
    quality = 2,
    format = 'a4',
    orientation = 'portrait',
    margin = 10,
    scale = 2
  } = options

  try {
    // Add print class to optimize rendering
    const originalClasses = element.className
    element.classList.add('pdf-export')
    
    // Wait for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 100))

    // Generate high-quality canvas
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      removeContainer: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure all images are loaded in the cloned document
        const images = clonedDoc.querySelectorAll('img')
        images.forEach((img: HTMLImageElement) => {
          if (img.src.startsWith('blob:') || img.src.startsWith('data:')) {
            // Keep blob and data URLs as-is
            return
          }
          // Ensure cross-origin images work
          img.crossOrigin = 'anonymous'
        })
      }
    })

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
      compress: true
    })

    // Calculate dimensions
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const contentWidth = pageWidth - (margin * 2)
    const contentHeight = pageHeight - (margin * 2)

    // Calculate image dimensions maintaining aspect ratio
    const imgProps = pdf.getImageProperties(canvas)
    const imgAspectRatio = imgProps.height / imgProps.width
    
    let imgWidth = contentWidth
    let imgHeight = imgWidth * imgAspectRatio

    // If image is taller than page, scale it down
    if (imgHeight > contentHeight) {
      imgHeight = contentHeight
      imgWidth = imgHeight / imgAspectRatio
    }

    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2
    const y = margin

    // Add image to PDF
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      x,
      y,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    )

    // If content is longer than one page, add additional pages
    if (imgHeight > contentHeight) {
      const totalPages = Math.ceil(imgHeight / contentHeight)
      
      for (let page = 1; page < totalPages; page++) {
        pdf.addPage()
        
        // Create canvas for this page section
        const pageCanvas = document.createElement('canvas')
        const pageCtx = pageCanvas.getContext('2d')!
        
        pageCanvas.width = canvas.width
        pageCanvas.height = canvas.height / totalPages
        
        // Draw the appropriate section of the original canvas
        pageCtx.drawImage(
          canvas,
          0, (canvas.height / totalPages) * page,
          canvas.width, canvas.height / totalPages,
          0, 0,
          pageCanvas.width, pageCanvas.height
        )
        
        pdf.addImage(
          pageCanvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          x,
          y,
          imgWidth,
          contentHeight,
          undefined,
          'FAST'
        )
      }
    }

    // Restore original classes
    element.className = originalClasses

    // Save the PDF
    pdf.save(filename)

  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

/**
 * Optimized PDF export specifically for CV content
 */
export async function exportCVToPDF(
  cvData: any,
  options: PDFExportOptions = {}
): Promise<void> {
  const element = document.querySelector('.cv-preview-container') as HTMLElement
  
  if (!element) {
    throw new Error('CV preview element not found')
  }

  const filename = options.filename || `${cvData.sidebar?.name || 'CV'}.pdf`
  
  return exportToPDF(element, {
    ...options,
    filename,
    quality: 2,
    scale: 2
  })
}

/**
 * Print-optimized PDF export using browser's print functionality
 */
export async function exportCVToPrintPDF(cvData: any): Promise<void> {
  // Create a new window with print-optimized content
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    throw new Error('Unable to open print window. Please allow popups.')
  }

  const cvElement = document.querySelector('.cv-preview-container')
  if (!cvElement) {
    throw new Error('CV preview element not found')
  }

  // Get the current styles
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  // Create print-optimized HTML
  const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${cvData.sidebar?.name || 'CV'}</title>
      <style>
        ${styles}
        
        /* Additional print optimizations */
        @media print {
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          body {
            font-size: 12pt;
            line-height: 1.3;
            color: black;
            background: white;
          }
          
          .cv-preview-container {
            transform: scale(0.9);
            transform-origin: top left;
          }
        }
        
        @media screen {
          body {
            margin: 20px;
            background: #f5f5f5;
          }
          
          .cv-preview-container {
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 210mm;
            margin: 0 auto;
          }
        }
      </style>
    </head>
    <body>
      ${cvElement.outerHTML}
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `

  printWindow.document.write(printHTML)
  printWindow.document.close()
}
