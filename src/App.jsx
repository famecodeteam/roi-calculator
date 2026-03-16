import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';

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
    const roiValue = costAnnual > 0 ? ((pipeline / costAnnual) * 100).toFixed(0) : 0;

    return {
      monthlyLeads: leads,
      annualDeals: deals,
      pipelineValue: pipeline,
      roi: roiValue
    };
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const results = calculateResults();
    
    try {
      const zapierPayload = {
        email: email,
        episodesPerMonth: episodesPerMonth,
        avgDownloads: avgDownloads,
        guestSeniority: guestSeniority,
        dealSize: dealSize,
        closeRate: closeRate,
        monthlyPodcastCost: monthlyPodcastCost,
        interestedInGuests: interestedInGuests ? 'Yes' : 'No',
        projectedLeads: results.monthlyLeads,
        projectedDeals: results.annualDeals,
        projectedPipelineValue: results.pipelineValue,
        roi: results.roi,
        timestamp: new Date().toISOString()
      };

      await fetch('https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_HOOK_ID_HERE/', {
        method: 'POST',
        body: JSON.stringify(zapierPayload)
      });

      setScreen('thankyou');
    } catch (error) {
      console.error('Error sending to Zapier:', error);
      setScreen('thankyou');
    }
  };

  const results = calculateResults();

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f1eb 0%, #fff5f1 100%)',
    display: 'flex',
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

  // Add webkit styles for slider thumb
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
    marginTop: '32px',
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const footerLinkStyle = {
    color: '#ff467c',
    textDecoration: 'none',
    fontWeight: '600',
    fontFamily: 'Figtree, sans-serif !important'
  };

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
                  <div style={labelStyle}>Guest seniority level</div>
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

            <div style={footerStyle}>
              Powered by <a href="https://fame.so" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Fame</a>
            </div>
          </div>
        </div>
      </>
    );
  }

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

  if (screen === 'thankyou') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerBoxStyle}>B2B Podcast ROI Calculator</div>
          <h2 style={headerStyle}>Thank You!</h2>
          <p style={descriptionStyle}>
            We've sent your report to {email}. Check your inbox for next steps.
          </p>
          <button
            style={buttonStyle}
            onClick={() => {
              setScreen('calculator');
              setEmail('');
            }}
          >
            Calculate Again
          </button>

          <div style={footerStyle}>
            Powered by <a href="https://fame.so" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Fame</a>
          </div>
        </div>
      </div>
    );
  }
}
