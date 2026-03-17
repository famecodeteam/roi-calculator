import { jsPDF } from 'jspdf';

// Helper function to draw rounded rectangles
function roundedRect(doc, x, y, width, height, radius, fillColor) {
  const k = 0.55228;
  const r = Math.min(radius, width / 2, height / 2);

  // Move to starting point
  doc.moveTo(x + r, y);

  // Top line
  doc.lineTo(x + width - r, y);

  // Top-right corner
  doc.bezierCurveTo(x + width - r * (1 - k), y, x + width, y + r * (1 - k), x + width, y + r);

  // Right line
  doc.lineTo(x + width, y + height - r);

  // Bottom-right corner
  doc.bezierCurveTo(x + width, y + height - r * (1 - k), x + width - r * (1 - k), y + height, x + width - r, y + height);

  // Bottom line
  doc.lineTo(x + r, y + height);

  // Bottom-left corner
  doc.bezierCurveTo(x + r * (1 - k), y + height, x, y + height - r * (1 - k), x, y + height - r);

  // Left line
  doc.lineTo(x, y + r);

  // Top-left corner
  doc.bezierCurveTo(x, y + r * (1 - k), x + r * (1 - k), y, x + r, y);

  // Close path and fill
  doc.closePath();
  if (fillColor) {
    doc.fill();
  }
  doc.stroke();
}

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const {
      email,
      episodesPerMonth,
      avgDownloads,
      dealSize,
      closeRate,
      monthlyPodcastCost,
      biggestLever,
      monthlyLeads,
      annualDeals,
      pipelineValue,
      roi,
      leverAction,
      leverRationale
    } = req.query;

    // Create PDF
    const doc = new jsPDF();

    // Colors (Fame brand)
    const pinkColor = [255, 70, 124]; // #ff467c
    const darkColor = [46, 46, 46]; // #2e2e2e
    const lightColor = [153, 153, 153]; // #999
    const creamColor = [248, 241, 235]; // #f8f1eb

    // Header
    doc.setFillColor(...pinkColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('B2B PODCAST ROI CALCULATOR', 15, 18);

    // Title
    doc.setTextColor(...darkColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Podcast ROI Report', 15, 50);

    // Subtitle
    doc.setTextColor(...lightColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Based on your podcast metrics, here\'s your projected annual impact:', 15, 60);

    // Results section header
    doc.setTextColor(...darkColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Projected Results', 15, 75);

    // Results background - rounded
    doc.setFillColor(...creamColor);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0);
    roundedRect(doc, 15, 80, 180, 70, 3);

    // Results grid - 2x2
    const resultItemWidth = 85;
    const resultItemHeight = 30;
    const col1X = 25;
    const col2X = 110;
    const row1Y = 85;
    const row2Y = 120;

    // Monthly Leads
    doc.setTextColor(...lightColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Monthly Leads', col1X, row1Y);
    doc.setTextColor(...pinkColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(monthlyLeads.toString(), col1X, row1Y + 12);

    // Annual Deals Closed
    doc.setTextColor(...lightColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Annual Deals Closed', col2X, row1Y);
    doc.setTextColor(...pinkColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(annualDeals.toString(), col2X, row1Y + 12);

    // Pipeline Value
    doc.setTextColor(...lightColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Pipeline Value', col1X, row2Y);
    doc.setTextColor(...pinkColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${parseInt(pipelineValue).toLocaleString()}`, col1X, row2Y + 12);

    // Annual ROI
    doc.setTextColor(...lightColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Annual ROI', col2X, row2Y);
    doc.setTextColor(...pinkColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${roi}x`, col2X, row2Y + 12);

    // Growth Opportunity section
    doc.setTextColor(...darkColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Your #1 Growth Opportunity', 15, 165);

    // Opportunity box - rounded
    doc.setFillColor(255, 232, 240); // #ffe8f0
    doc.setDrawColor(...pinkColor);
    doc.setLineWidth(0.75);
    roundedRect(doc, 15, 172, 180, 85, 3);

    // Lever name
    doc.setTextColor(...pinkColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Optimize: ${biggestLever}`, 22, 183);

    // Action
    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const actionLines = doc.splitTextToSize(`Action: ${leverAction}`, 165);
    doc.text(actionLines, 22, 193);

    // Rationale
    const rationaleStartY = 193 + (actionLines.length * 4) + 4;
    const rationaleLines = doc.splitTextToSize(`Why it matters: ${leverRationale}`, 165);
    doc.text(rationaleLines, 22, rationaleStartY);

    // Footer message
    doc.setTextColor(...lightColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Making this one change could significantly improve your podcast ROI.', 15, 265);
    doc.text('Start with this lever, measure the results, and iterate from there.', 15, 271);

    // Powered by Fame
    doc.setTextColor(...lightColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Powered by Fame', 15, 285);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="podcast-roi-report.pdf"`);

    // Send PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.end(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
