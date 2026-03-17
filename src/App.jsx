import React, { useState } from 'react';
import { Mail, X, Download } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('calculator');
  const [episodesPerMonth, setEpisodesPerMonth] = useState(4);
  const [avgDownloads, setAvgDownloads] = useState(5000);
  const [guestSeniority, setGuestSeniority] = useState('vp');
  const [dealSize, setDealSize] = useState(50000);
  const [closeRate, setCloseRate] = useState(15);
  const [monthlyPodcastCost, setMonthlyPodcastCost] = useState(2000);
  const [interestedInGuests, setInterestedInGuests] = useState(true);
  const [email, setEmail] = useState('');
  const [reportData, setReportData] = useState(null);

  const calculateResults = () => {
    const episodes = parseInt(episodesPerMonth) || 0;
    const downloads = parseInt(avgDownloads) || 0;
    const deal = parseInt(dealSize) || 0;
    const close = parseInt(closeRate) || 0;
    const cost = parseInt(monthlyPodcastCost) || 0;

    let baseConversionRate = 0.0001;
    
    if (guestSeniority === 'cLevel' && interestedInGuests) {
      baseConversionRate = 0.0002;
    } else if (guestSeniority === 'vp' && interestedInGuests) {
      baseConversionRate = 0.00015;
    }

    const monthlyImpressions = episodes * downloads;
    let leads = Math.round(monthlyImpressions * baseConversionRate);

    if (interestedInGuests && guestSeniority) {
      const guestBonus = Math.round(episodes * 0.1);
      leads += guestBonus;
    }

    const deals = Math.round(leads * (close / 100));
    const pipeline = deals * deal;
    const costAnnual = cost * 12;
    const roiValue = costAnnual > 0 ? (pipeline / costAnnual).toFixed(2) : 0;

    return {
      monthlyLeads: leads,
      annualDeals: deals,
      pipelineValue: pipeline,
      roi: roiValue,
      monthlyImpressions,
      costAnnual
    };
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateReportURL = (lever, results) => {
    const reportId = generateRandomId();
    const params = new URLSearchParams({
      email: email,
      episodesPerMonth: episodesPerMonth,
      avgDownloads: avgDownloads,
      dealSize: dealSize,
      closeRate: closeRate,
      monthlyPodcastCost: monthlyPodcastCost,
      biggestLever: lever.name,
      monthlyLeads: results.monthlyLeads,
      annualDeals: results.annualDeals,
      pipelineValue: results.pipelineValue,
      roi: results.roi,
      leverAction: lever.action,
      leverRationale: lever.rationale
    });
    const domain = typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : 'roi.fame.so';
    return `https://${domain}/api/report/${reportId}?${params.toString()}`;
  };

  const identifyBiggestLever = () => {
    const results = calculateResults();
    const metrics = [
      {
        name: 'Sales Close Rate',
        current: closeRate,
        max: 100,
        impact: 'high',
        action: `Improve your sales process to increase close rate from ${closeRate}% to ${closeRate + 5}%`,
        rationale: 'Converting more leads into deals directly increases pipeline value.',
        ease: 'medium'
      },
      {
        name: 'Average Downloads',
        current: avgDownloads,
        max: 50000,
        impact: 'high',
        action: `Improve episode promotion strategy to increase downloads from ${avgDownloads.toLocaleString()} to ${Math.round(avgDownloads * 1.2).toLocaleString()}`,
        rationale: 'More listeners per episode directly increases your reach and lead generation.',
        ease: 'medium'
      },
      {
        name: 'Monthly Podcast Cost',
        current: monthlyPodcastCost,
        max: 10000,
        impact: 'direct',
        action: `Negotiate lower production costs or find efficiency gains to reduce costs from $${monthlyPodcastCost.toLocaleString()} to $${Math.round(monthlyPodcastCost * 0.8).toLocaleString()}`,
        rationale: 'Lower costs directly improve your ROI multiplier without needing more leads.',
        ease: 'high'
      },
      {
        name: 'Episodes Per Month',
        current: episodesPerMonth,
        max: 16,
        impact: 'medium',
        action: `Increase publishing frequency from ${episodesPerMonth} to ${episodesPerMonth + 1} episodes per month`,
        rationale: 'More episodes increase your total audience reach and guest opportunities.',
        ease: 'high'
      },
      {
        name: 'Guest Strategy',
        current: interestedInGuests ? 1 : 0,
        max: 1,
        impact: 'medium',
        action: `Develop a systematic guest acquisition strategy to bring on ${interestedInGuests ? 'more' : 'high-value'} guests each month`,
        rationale: 'Guests add both audience reach and conversion rate improvements.',
        ease: interestedInGuests ? 'medium' : 'high'
      },
      {
        name: 'Deal Size',
        current: dealSize,
        max: 500000,
        impact: 'high',
        action: `Focus on higher-value contracts or expansion deals to increase average deal size from $${dealSize.toLocaleString()} to $${Math.round(dealSize * 1.2).toLocaleString()}`,
        rationale: 'Larger deals directly multiply your pipeline value.',
        ease: 'low'
      }
    ];

    // Score each metric by room for improvement
    const scored = metrics.map(m => ({
      ...m,
      percentageOfMax: (m.current / m.max) * 100,
      opportunity: m.max - m.current
    }));

    // Prioritize by: lowest % of max, then by ease, then by impact
    const sorted = scored.sort((a, b) => {
      const aScore = a.percentageOfMax - (a.ease === 'high' ? 10 : a.ease === 'medium' ? 5 : 0);
      const bScore = b.percentageOfMax - (b.ease === 'high' ? 10 : b.ease === 'medium' ? 5 : 0);
      return aScore - bScore;
    });

    return sorted[0];
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const results = calculateResults();
    const lever = identifyBiggestLever();
    const reportURL = generateReportURL(lever, results);

    setReportData({
      results,
      lever,
      inputs: {
        episodesPerMonth,
        avgDownloads,
        guestSeniority,
        dealSize,
        closeRate,
        monthlyPodcastCost,
        interestedInGuests
      }
    });

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('episodesPerMonth', episodesPerMonth);
      formData.append('avgDownloads', avgDownloads);
      formData.append('guestSeniority', guestSeniority);
      formData.append('dealSize', dealSize);
      formData.append('closeRate', closeRate);
      formData.append('monthlyPodcastCost', monthlyPodcastCost);
      formData.append('interestedInGuests', interestedInGuests ? 'Yes' : 'No');
      formData.append('projectedLeads', results.monthlyLeads);
      formData.append('projectedDeals', results.annualDeals);
      formData.append('projectedPipelineValue', results.pipelineValue);
      formData.append('roi', results.roi);
      formData.append('timestamp', new Date().toISOString());
      formData.append('biggestLever', lever.name);
      formData.append('reportURL', reportURL);

      await fetch('https://hooks.zapier.com/hooks/catch/5322222/upo96yz/', {
        method: 'POST',
        body: formData
      });

      setScreen('report');
    } catch (error) {
      console.error('Error sending to Zapier:', error);
      setScreen('report');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const results = calculateResults();

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f1eb 0%, #fff5f1 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '1200px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'start'
  };

  const headerBoxStyle = {
    display: 'inline-block',
    background: '#ff467c',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '20px',
    fontFamily: 'Figtree, sans-serif !important',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const headerStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2e2e2e',
    marginBottom: '12px',
    fontFamily: 'Figtree, sans-serif !important',
    gridColumn: '1 / -1'
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    lineHeight: '1.6',
    fontFamily: 'Figtree, sans-serif !important',
    gridColumn: '1 / -1'
  };

  const sliderContainerStyle = {
    marginBottom: '28px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2e2e2e',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ff467c',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#e0e0e0',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const sliderStyleWithThumb = `
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #e0e0e0;
      outline: none;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ff467c;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(255, 70, 124, 0.3);
    }
    input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ff467c;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(255, 70, 124, 0.3);
    }
  `;

  const selectStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '24px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Figtree, sans-serif !important',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '18px',
    paddingRight: '40px'
  };

  const toggleContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  };

  const toggleButtonStyle = (isSelected) => ({
    flex: 1,
    padding: '12px',
    border: isSelected ? '2px solid #ff467c' : '2px solid #ddd',
    background: isSelected ? '#ffe8f0' : 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    color: isSelected ? '#ff467c' : '#666',
    fontFamily: 'Figtree, sans-serif !important',
    fontSize: '14px'
  });

  const resultsBoxStyle = {
    background: '#f8f1eb',
    padding: '28px',
    borderRadius: '8px',
    marginBottom: '24px'
  };

  const resultItemStyle = {
    marginBottom: '24px'
  };

  const resultItemLastStyle = {
    marginBottom: 0
  };

  const resultLabelStyle = {
    fontSize: '12px',
    color: '#999',
    marginBottom: '6px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const resultValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ff467c',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 24px',
    background: '#ff467c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Figtree, sans-serif !important',
    transition: 'background 0.3s ease'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000
  };

  const modalStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const exitButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
    padding: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'Figtree, sans-serif !important',
    boxSizing: 'border-box'
  };

  const footerStyle = {
    fontSize: '12px',
    color: '#999',
    marginTop: '16px',
    textAlign: 'center',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const footerLinkStyle = {
    color: '#ff467c',
    textDecoration: 'none',
    fontWeight: '600',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const reportStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const leverBoxStyle = {
    background: '#ffe8f0',
    border: '2px solid #ff467c',
    borderRadius: '8px',
    padding: '24px',
    marginTop: '24px'
  };

  const leverTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ff467c',
    marginBottom: '12px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const leverTextStyle = {
    fontSize: '14px',
    color: '#2e2e2e',
    lineHeight: '1.6',
    marginBottom: '12px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const downloadButtonStyle = {
    ...buttonStyle,
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  // Calculator Screen
  if (screen === 'calculator') {
    return (
      <>
        <style>{sliderStyleWithThumb}</style>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={headerBoxStyle}>B2B Podcast ROI Calculator</div>
            <h1 style={headerStyle}>Will Your B2B Podcast Make Money?</h1>
            <p style={descriptionStyle}>
              Calculate your projected revenue impact and pipeline value based on your show's strategy, metrics and cadence.
            </p>

            <div style={layoutStyle}>
              <div>
                <div style={sliderContainerStyle}>
                  <div style={labelStyle}>
                    <span>Episodes per month</span>
                    <span style={valueStyle}>{episodesPerMonth}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={episodesPerMonth}
                    onChange={(e) => setEpisodesPerMonth(parseInt(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <div style={sliderContainerStyle}>
                  <div style={labelStyle}>
                    <span>Average downloads per episode</span>
                    <span style={valueStyle}>{avgDownloads.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={avgDownloads}
                    onChange={(e) => setAvgDownloads(parseInt(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <div style={sliderContainerStyle}>
                  <div style={labelStyle}>
                    <span>Average deal size</span>
                    <span style={valueStyle}>${dealSize.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={dealSize}
                    onChange={(e) => setDealSize(parseInt(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <div style={sliderContainerStyle}>
                  <div style={labelStyle}>
                    <span>Sales close rate (%)</span>
                    <span style={valueStyle}>{closeRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={closeRate}
                    onChange={(e) => setCloseRate(parseInt(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <div style={sliderContainerStyle}>
                  <div style={labelStyle}>
                    <span>Monthly podcast cost</span>
                    <span style={valueStyle}>${monthlyPodcastCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={monthlyPodcastCost}
                    onChange={(e) => setMonthlyPodcastCost(parseInt(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <div style={sliderContainerStyle}>
                  <label style={labelStyle}>Guest seniority level</label>
                  <select
                    value={guestSeniority}
                    onChange={(e) => setGuestSeniority(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="cLevel">C-Level (CEO, CTO, CMO)</option>
                    <option value="vp">VP / Senior Manager</option>
                    <option value="manager">Manager / IC</option>
                  </select>
                </div>

                <div style={sliderContainerStyle}>
                  <div style={labelStyle}>Are you interested in bringing on guests that could be customers or partners?</div>
                  <div style={toggleContainerStyle}>
                    <button
                      style={toggleButtonStyle(interestedInGuests === true)}
                      onClick={() => setInterestedInGuests(true)}
                    >
                      Yes
                    </button>
                    <button
                      style={toggleButtonStyle(interestedInGuests === false)}
                      onClick={() => setInterestedInGuests(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div style={resultsBoxStyle}>
                  <div style={resultItemStyle}>
                    <div style={resultLabelStyle}>Monthly Leads</div>
                    <div style={resultValueStyle}>{results.monthlyLeads}</div>
                  </div>
                  <div style={resultItemStyle}>
                    <div style={resultLabelStyle}>Annual Deals Closed</div>
                    <div style={resultValueStyle}>{results.annualDeals}</div>
                  </div>
                  <div style={resultItemStyle}>
                    <div style={resultLabelStyle}>Pipeline Value</div>
                    <div style={resultValueStyle}>${results.pipelineValue.toLocaleString()}</div>
                  </div>
                  <div style={resultItemLastStyle}>
                    <div style={resultLabelStyle}>Annual ROI</div>
                    <div style={resultValueStyle}>{results.roi}x</div>
                  </div>
                </div>

                <button
                  style={buttonStyle}
                  onClick={() => setScreen('email')}
                >
                  See Full Report
                </button>
              </div>
            </div>
          </div>

          <div style={footerStyle}>
            Powered by <a href="https://fame.so" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Fame</a>
          </div>
        </div>
      </>
    );
  }

  // Email Modal Screen
  if (screen === 'email') {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <button style={exitButtonStyle} onClick={() => setScreen('calculator')}>
            <X size={24} />
          </button>
          <div style={headerBoxStyle}>B2B Podcast ROI Calculator</div>
          <h2 style={headerStyle}>Get Your Full Report</h2>
          <p style={descriptionStyle}>
            Enter your email to receive detailed insights and a custom action plan.
          </p>
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              <Mail size={18} style={{ marginRight: '8px', verticalAlign: 'middle', fontFamily: 'Figtree, sans-serif !important' }} />
              Send My Report
            </button>
          </form>

          <div style={footerStyle}>
            Powered by <a href="https://fame.so" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Fame</a>
          </div>
        </div>
      </div>
    );
  }

  // Report Screen
  if (screen === 'report' && reportData) {
    return (
      <div style={containerStyle}>
        <div style={reportStyle}>
          <div style={headerBoxStyle}>B2B Podcast ROI Calculator</div>
          <h1 style={headerStyle}>Your Podcast ROI Report</h1>
          
          <p style={descriptionStyle}>
            Based on your podcast metrics, here's your projected annual impact:
          </p>

          <div style={resultsBoxStyle}>
            <div style={resultItemStyle}>
              <div style={resultLabelStyle}>Monthly Leads</div>
              <div style={resultValueStyle}>{reportData.results.monthlyLeads}</div>
            </div>
            <div style={resultItemStyle}>
              <div style={resultLabelStyle}>Annual Deals Closed</div>
              <div style={resultValueStyle}>{reportData.results.annualDeals}</div>
            </div>
            <div style={resultItemStyle}>
              <div style={resultLabelStyle}>Projected Pipeline Value</div>
              <div style={resultValueStyle}>${reportData.results.pipelineValue.toLocaleString()}</div>
            </div>
            <div style={resultItemLastStyle}>
              <div style={resultLabelStyle}>Annual ROI</div>
              <div style={resultValueStyle}>{reportData.results.roi}x</div>
            </div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2e2e2e', marginTop: '32px', marginBottom: '16px', fontFamily: 'Figtree, sans-serif !important' }}>
            Your #1 Growth Opportunity
          </h2>

          <div style={leverBoxStyle}>
            <div style={leverTitleStyle}>Optimize: {reportData.lever.name}</div>
            <div style={leverTextStyle}>
              <strong>Action:</strong> {reportData.lever.action}
            </div>
            <div style={leverTextStyle}>
              <strong>Why it matters:</strong> {reportData.lever.rationale}
            </div>
          </div>

          <p style={{ ...descriptionStyle, marginTop: '32px', color: '#666', fontSize: '14px' }}>
            Making this one change could significantly improve your podcast ROI. Start with this lever, measure the results, and iterate from there.
          </p>

          <button style={downloadButtonStyle} onClick={handlePrintReport}>
            <Download size={18} />
            Download / Print Report
          </button>

          <a
            href="https://www.fame.so/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...buttonStyle, display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '12px' }}
          >
            Check Out Fame
          </a>
        </div>

        <div style={footerStyle}>
          Powered by <a href="https://fame.so" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Fame</a>
        </div>
      </div>
    );
  }
}
