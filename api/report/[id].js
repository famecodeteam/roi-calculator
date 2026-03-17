import { jsPDF } from 'jspdf';

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

    // Set font
    doc.setFont('Figtree', 'normal');

    // Colors (Fame brand)
    const pinkColor = [255, 70, 124]; // #ff467c
    const darkColor = [46, 46, 46]; // #2e2e2e
    const lightColor = [153, 153, 153]; // #999

    // Header box
    doc.setFillColor(...pinkColor);
    doc.rect(20, 20, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('Figtree', 'bold');
    doc.text('B2B PODCAST ROI CALCULATOR', 25, 28);

    // Title
    doc.setTextColor(...darkColor);
    doc.setFontSize(28);
    doc.setFont('Figtree', 'bold');
    doc.text('Your Podcast ROI Report', 20, 50);

    // Subtitle
    doc.setTextColor(...lightColor);
    doc.setFontSize(12);
    doc.setFont('Figtree', 'normal');
    doc.text('Based on your podcast metrics, here\'s your projected annual impact:', 20, 60);

    // Results section
    doc.setFillColor(248, 241, 235); // #f8f1eb
    doc.rect(20, 70, 170, 80, 'F');

    doc.setTextColor(...lightColor);
    doc.setFontSize(10);
    doc.setFont('Figtree', 'normal');

    // Results grid
    const col1X = 30;
    const col2X = 110;
    const row1Y = 78;
    const row2Y = 98;
    const row3Y = 118;
    const row4Y = 138;

    doc.text('Monthly Leads', col1X, row1Y);
    doc.setTextColor(...pinkColor);
    doc.setFont('Figtree', 'bold');
    doc.setFontSize(18);
    doc.text(monthlyLeads, col1X, row1Y + 10);

    doc.setTextColor(...lightColor);
    doc.setFont('Figtree', 'normal');
    doc.setFontSize(10);
    doc.text('Annual Deals Closed', col2X, row1Y);
    doc.setTextColor(...pinkColor);
    doc.setFont('Figtree', 'bold');
    doc.setFontSize(18);
    doc.text(annualDeals, col2X, row1Y + 10);

    doc.setTextColor(...lightColor);
    doc.setFont('Figtree', 'normal');
    doc.setFontSize(10);
    doc.text('Pipeline Value', col1X, row3Y);
    doc.setTextColor(...pinkColor);
    doc.setFont('Figtree', 'bold');
    doc.setFontSize(18);
    doc.text(`$${parseInt(pipelineValue).toLocaleString()}`, col1X, row3Y + 10);

    doc.setTextColor(...lightColor);
    doc.setFont('Figtree', 'normal');
    doc.setFontSize(10);
    doc.text('Annual ROI', col2X, row3Y);
    doc.setTextColor(...pinkColor);
    doc.setFont('Figtree', 'bold');
    doc.setFontSize(18);
    doc.text(`${roi}x`, col2X, row3Y + 10);

    // Opportunity section
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont('Figtree', 'bold');
    doc.text('Your #1 Growth Opportunity', 20, 165);

    // Opportunity box
    doc.setFillColor(255, 232, 240); // #ffe8f0
    doc.setDrawColor(...pinkColor);
    doc.setLineWidth(0.5);
    doc.rect(20, 173, 170, 90, 'FD');

    // Lever name
    doc.setTextColor(...pinkColor);
    doc.setFontSize(12);
    doc.setFont('Figtree', 'bold');
    doc.text(`Optimize: ${biggestLever}`, 25, 183);

    // Action
    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    doc.setFont('Figtree', 'normal');
    const actionLines = doc.splitTextToSize(`Action: ${leverAction}`, 160);
    doc.text(actionLines, 25, 193);

    // Rationale
    const rationaleStartY = 193 + (actionLines.length * 4) + 5;
    const rationaleLines = doc.splitTextToSize(`Why it matters: ${leverRationale}`, 160);
    doc.text(rationaleLines, 25, rationaleStartY);

    // Footer message
    doc.setTextColor(...lightColor);
    doc.setFontSize(9);
    doc.setFont('Figtree', 'normal');
    const footerY = 270;
    doc.text('Making this one change could significantly improve your podcast ROI.', 20, footerY);
    doc.text('Start with this lever, measure the results, and iterate from there.', 20, footerY + 6);

    // Powered by Fame
    doc.setTextColor(...lightColor);
    doc.setFontSize(8);
    doc.text('Powered by Fame', 20, 285);

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
