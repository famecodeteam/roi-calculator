import puppeteer from 'puppeteer-core';
import chrome from '@sparticuz/chromium';

export default async function handler(req, res) {
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

    // Launch browser
    const browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: chrome.headless,
    });

    const page = await browser.newPage();

    // HTML content matching the web design exactly
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              font-family: 'Figtree', sans-serif !important;
              margin: 0;
              padding: 0;
            }
            body {
              background: #f8f1eb;
              padding: 40px 20px;
            }
            .container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            .header-box {
              display: inline-block;
              background: #ff467c;
              color: white;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 700;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            h1 {
              font-size: 32px;
              font-weight: 700;
              color: #2e2e2e;
              margin-bottom: 12px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 32px;
              line-height: 1.6;
            }
            .results-box {
              background: #f8f1eb;
              padding: 28px;
              border-radius: 8px;
              margin-bottom: 32px;
              border: 1px solid #e8e0d8;
            }
            .results-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
            }
            .result-item {
              margin-bottom: 24px;
            }
            .result-label {
              font-size: 12px;
              color: #999;
              margin-bottom: 6px;
            }
            .result-value {
              font-size: 32px;
              font-weight: 700;
              color: #ff467c;
            }
            h2 {
              font-size: 24px;
              font-weight: 700;
              color: #2e2e2e;
              margin-top: 32px;
              margin-bottom: 16px;
            }
            .lever-box {
              background: #ffe8f0;
              border: 2px solid #ff467c;
              border-radius: 8px;
              padding: 24px;
              margin-top: 24px;
            }
            .lever-title {
              font-size: 18px;
              font-weight: 700;
              color: #ff467c;
              margin-bottom: 12px;
            }
            .lever-text {
              font-size: 14px;
              color: #2e2e2e;
              line-height: 1.6;
              margin-bottom: 12px;
            }
            .footer-text {
              margin-top: 32px;
              color: #666;
              font-size: 14px;
              line-height: 1.6;
            }
            .powered-by {
              font-size: 12px;
              color: #999;
              margin-top: 20px;
              text-align: center;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .container {
                box-shadow: none;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header-box">B2B PODCAST ROI CALCULATOR</div>
            <h1>Your Podcast ROI Report</h1>
            <p class="subtitle">Based on your podcast metrics, here's your projected annual impact:</p>

            <div class="results-box">
              <div class="results-grid">
                <div>
                  <div class="result-item">
                    <div class="result-label">Monthly Leads</div>
                    <div class="result-value">${monthlyLeads}</div>
                  </div>
                  <div class="result-item">
                    <div class="result-label">Pipeline Value</div>
                    <div class="result-value">$${parseInt(pipelineValue).toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <div class="result-item">
                    <div class="result-label">Annual Deals Closed</div>
                    <div class="result-value">${annualDeals}</div>
                  </div>
                  <div class="result-item">
                    <div class="result-label">Annual ROI</div>
                    <div class="result-value">${roi}x</div>
                  </div>
                </div>
              </div>
            </div>

            <h2>Your #1 Growth Opportunity</h2>

            <div class="lever-box">
              <div class="lever-title">Optimize: ${biggestLever}</div>
              <div class="lever-text">
                <strong>Action:</strong> ${leverAction}
              </div>
              <div class="lever-text">
                <strong>Why it matters:</strong> ${leverRationale}
              </div>
            </div>

            <p class="footer-text">
              Making this one change could significantly improve your podcast ROI. Start with this lever, measure the results, and iterate from there.
            </p>

            <div class="powered-by">
              Powered by Fame
            </div>
          </div>
        </body>
      </html>
    `;

    // Set content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: 0, right: 0, bottom: 0, left: 0 } });

    await browser.close();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="podcast-roi-report.pdf"`);

    // Send PDF
    res.end(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
