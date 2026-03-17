import puppeteer from 'puppeteer-core';
import chrome from '@sparticuz/chromium';

// Blog resources mapped to levers
const blogResources = {
  'Average Downloads': {
    title: 'How to Promote a Podcast',
    url: 'https://www.fame.so/post/how-to-promote-a-podcast'
  },
  'Guest Strategy': {
    withGuests: {
      title: 'How to Find Podcast Guests',
      url: 'https://www.bcast.fm/blog/how-to-find-podcast-guests'
    },
    withoutGuests: {
      title: 'B2B Podcast ROI: Guest & Listener Conversion',
      url: 'https://www.fame.so/post/b2b-podcast-roi-guest-listener-conversion'
    }
  },
  'Monthly Podcast Cost': {
    title: 'B2B Podcast Agency ROI',
    url: 'https://www.fame.so/post/b2b-podcast-agency-roi'
  },
  'Sales Close Rate': {
    title: 'Podcast ROI Playbook',
    url: 'https://www.fame.so/post/podcast-roi-playbook'
  },
  'Episodes Per Month': {
    title: 'How to Find Podcast Guests',
    url: 'https://www.bcast.fm/blog/how-to-find-podcast-guests'
  },
  'Deal Size': {
    title: 'Podcast ROI Playbook',
    url: 'https://www.fame.so/post/podcast-roi-playbook'
  }
};

const getResourceForLever = (leverName, interestedInGuests = true) => {
  const resource = blogResources[leverName];
  if (leverName === 'Guest Strategy' && resource) {
    return interestedInGuests ? resource.withGuests : resource.withoutGuests;
  }
  return resource || null;
};

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
      leverRationale,
      interestedInGuests
    } = req.query;

    // Get relevant blog resource for this lever
    const interestedInGuestsBoolean = interestedInGuests === 'Yes';
    const blogResource = getResourceForLever(biggestLever, interestedInGuestsBoolean);

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
            .blog-link {
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px solid rgba(255, 70, 124, 0.2);
            }
            .blog-link a {
              font-size: 13px;
              font-weight: 600;
              color: #ff467c;
              text-decoration: none;
            }
            .blog-link a:hover {
              text-decoration: underline;
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
              ${blogResource ? `
              <div class="blog-link">
                <a href="${blogResource.url}" target="_blank">→ Read: ${blogResource.title}</a>
              </div>
              ` : ''}
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
