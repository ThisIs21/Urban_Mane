import { useRef, useCallback } from 'react';

/**
 * useReceipt Hook
 * Utilities untuk print dan export PDF receipt
 */
export const useReceipt = () => {
  const receiptRef = useRef(null);

  /**
   * Cetak receipt menggunakan window.print()
   * Auto-trigger print dialog
   */
  const printReceipt = useCallback(async () => {
    if (!receiptRef.current) {
      console.error('Receipt ref not found');
      return;
    }

    try {
      const printWindow = window.open('', '' , 'width=80mm,height=auto');
      const printDoc = printWindow.document;

      // Write HTML content
      printDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receipt</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Courier New', monospace;
                background: white;
                padding: 0;
              }
              ${getReceiptStyles()}
            </style>
          </head>
          <body>
            ${receiptRef.current.innerHTML}
          </body>
        </html>
      `);

      printDoc.close();

      // Wait for content to load
      printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 100);
      };
    } catch (error) {
      console.error('Print error:', error);
    }
  }, []);

  /**
   * Export receipt sebagai PDF
   * Menggunakan html2pdf library (perlu install)
   */
  const exportToPDF = useCallback(async (filename = 'receipt.pdf') => {
    if (!receiptRef.current) {
      console.error('Receipt ref not found');
      return;
    }

    try {
      // Check if html2pdf is available
      if (typeof window.html2pdf === 'undefined') {
        console.warn('html2pdf not loaded. Install: npm install html2pdf.js');
        // Fallback to basic print approach
        printReceipt();
        return;
      }

      const element = receiptRef.current;
      const opt = {
        margin: [5, 5, 5, 5],
        filename: filename,
        image: { type: 'image/png', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: [80, 200], orientation: 'p' },
      };

      await window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF export error:', error);
      // Fallback to print
      console.warn('Falling back to print dialog');
      printReceipt();
    }
  }, [printReceipt]);

  /**
   * Download receipt sebagai canvas/image
   * Alternative if html2pdf tidak tersedia
   */
  const downloadAsImage = useCallback(async () => {
    if (!receiptRef.current) {
      console.error('Receipt ref not found');
      return;
    }

    try {
      if (typeof window.html2canvas === 'undefined') {
        console.warn('html2canvas not loaded. Install: npm install html2canvas');
        return;
      }

      const canvas = await window.html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `receipt-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Image export error:', error);
    }
  }, []);

  /**
   * Auto-print setelah delay
   * Useful untuk auto-trigger setelah payment success
   */
  const autoPrintAfterDelay = useCallback((delayMs = 500) => {
    setTimeout(() => {
      printReceipt();
    }, delayMs);
  }, [printReceipt]);

  return {
    receiptRef,
    printReceipt,
    exportToPDF,
    downloadAsImage,
    autoPrintAfterDelay,
  };
};

/**
 * Embedded CSS styles untuk print
 */
function getReceiptStyles() {
  return `
    .receipt-container {
      width: 80mm;
      max-width: 100%;
      margin: 0 auto;
      padding: 15px;
      background-color: #fff;
      color: #000;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      text-align: center;
    }

    .receipt-header {
      text-align: center;
      margin-bottom: 12px;
    }

    .receipt-logo {
      font-size: 32px;
      margin-bottom: 4px;
    }

    .receipt-title {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      margin: 4px 0;
      letter-spacing: 1px;
      color: #141312;
    }

    .receipt-subtitle {
      font-size: 10px;
      color: #666;
      margin: 2px 0 0 0;
      font-weight: normal;
    }

    .receipt-divider {
      border-top: 2px dashed #999;
      margin: 10px 0;
      opacity: 0.8;
    }

    .receipt-divider-thin {
      border-top: 1px solid #ccc;
      margin: 6px 0;
    }

    .receipt-info,
    .receipt-people,
    .receipt-payment {
      margin: 8px 0;
      text-align: left;
      font-size: 12px;
    }

    .receipt-row {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      gap: 2px;
    }

    .receipt-row.change {
      color: #4CAF7D;
      font-weight: bold;
    }

    .receipt-row.discount {
      color: #E05252;
    }

    .receipt-label {
      flex-shrink: 0;
      font-weight: bold;
      color: #333;
    }

    .receipt-value {
      flex: 1;
      text-align: right;
      color: #000;
    }

    .receipt-items {
      margin: 8px 0;
      text-align: left;
    }

    .receipt-items-header {
      display: grid;
      grid-template-columns: 1fr 40px 50px;
      gap: 4px;
      margin-bottom: 4px;
      font-weight: bold;
      font-size: 11px;
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }

    .receipt-items-header .col-name {
      text-align: left;
    }

    .receipt-items-header .col-qty {
      text-align: center;
    }

    .receipt-items-header .col-price {
      text-align: right;
    }

    .receipt-items-row {
      display: grid;
      grid-template-columns: 1fr 40px 50px;
      gap: 4px;
      margin: 3px 0;
      font-size: 12px;
      align-items: center;
    }

    .receipt-items-row .col-name {
      text-align: left;
      word-break: break-word;
    }

    .receipt-items-row .col-qty {
      text-align: center;
    }

    .receipt-items-row .col-price {
      text-align: right;
      font-weight: bold;
    }

    .receipt-summary {
      margin: 8px 0;
      text-align: right;
    }

    .receipt-summary-row {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      font-size: 12px;
    }

    .receipt-summary-row.total {
      font-size: 14px;
      font-weight: bold;
      color: #141312;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #ccc;
    }

    .receipt-summary-row.discount {
      color: #E05252;
    }

    .receipt-footer {
      text-align: center;
      margin-top: 12px;
      font-size: 11px;
      color: #666;
    }

    .receipt-footer p {
      margin: 3px 0;
    }

    .receipt-footer-date {
      font-size: 10px;
      color: #999;
      margin-top: 6px;
    }
  `;
}

export default useReceipt;
