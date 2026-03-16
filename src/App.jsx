import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [episodesPerMonth, setEpisodesPerMonth] = useState('');
  const [avgDownloads, setAvgDownloads] = useState('');
  const [guestSeniority, setGuestSeniority] = useState('');
  const [dealSize, setDealSize] = useState('');
  const [closeRate, setCloseRate] = useState('');
  const [monthlyPodcastCost, setMonthlyPodcastCost] = useState('');
  const [interestedInGuests, setInterestedInGuests] = useState(null);
  const [email, setEmail] = useState('');
  const [projectedLeads, setProjectedLeads] = useState(0);
  const [projectedDeals, setProjectedDeals] = useState(0);
  const [projectedPipelineValue, setProjectedPipelineValue] = useState(0);
  const [roi, setRoi] = useState(0);

  const handleNext = () => {
    if (currentScreen === 'welcome') {
      setCurrentScreen('metrics');
    } else if (currentScreen === 'metrics') {
      setCurrentScreen('engagement');
    } else if (currentScreen === 'engagement') {
      if (interestedInGuests === null) {
        alert('Please answer the guest question before proceeding.');
        return;
      }
      setCurrentScreen('costs');
    } else if (currentScreen === 'costs') {
      calculateResults();
      setCurrentScreen('results');
    }
  };

  const calculateResults = () => {
    const episodes = parseInt(episodesPerMonth) || 0;
    const downloads = parseInt(avgDownloads) || 0;
    const deal = parseInt(dealSize) || 0;
    const close = parseInt(closeRate) || 0;
    const cost = parseInt(monthlyPodcastCost) || 0;

    let baseConversionRate = 0.0001; // 0.01%
    
    if (guestSeniority === 'cLevel' && interestedInGuests) {
      baseConversionRate = 0.0002; // 0.02% for C-Level with guests
    } else if (guestSeniority === 'vp' && interestedInGuests) {
      baseConversionRate = 0.00015; // 0.015% for VP with guests
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

    setProjectedLeads(leads);
    setProjectedDeals(deals);
    setProjectedPipelineValue(pipeline);
    setRoi(roiValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        projectedLeads: projectedLeads,
        projectedDeals: projectedDeals,
        projectedPipelineValue: projectedPipelineValue,
        roi: roi,
        timestamp: new Date().toISOString()
      };

      await fetch('https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_HOOK_ID_HERE/', {
        method: 'POST',
        body: JSON.stringify(zapierPayload)
      });

      setCurrentScreen('thankyou');
    } catch (error) {
      console.error('Error sending to Zapier:', error);
      setCurrentScreen('thankyou');
    }
  };

  const handleExit = () => {
    setCurrentScreen('welcome');
    setEpisodesPerMonth('');
    setAvgDownloads('');
    setGuestSeniority('');
    setDealSize('');
    setCloseRate('');
    setMonthlyPodcastCost('');
    setInterestedInGuests(null);
    setEmail('');
  };

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
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2e2e2e',
    marginBottom: '12px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    lineHeight: '1.6',
    fontFamily: 'Figtree, sans-serif !important'
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

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    paddingRight: '40px',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 24px',
    marginTop: '24px',
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

  const questionStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2e2e2e',
    marginBottom: '16px',
    marginTop: '24px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const buttonGroupStyle = {
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
    fontFamily: 'Figtree, sans-serif !important'
  });

  const resultStyle = {
    background: '#f8f1eb',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const resultLabelStyle = {
    fontSize: '14px',
    color: '#999',
    marginBottom: '8px',
    fontFamily: 'Figtree, sans-serif !important'
  };

  const resultValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ff467c',
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

  if (currentScreen === 'welcome') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headerStyle}>Will Your B2B Podcast Make Money?</h1>
          <p style={descriptionStyle}>
            Calculate your projected revenue impact and pipeline value based on your show's strategy, metrics and cadence.
          </p>
          <button style={buttonStyle} onClick={handleNext}>
            Start Calculation
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'metrics') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headerStyle}>Your Podcast Metrics</h2>
          <p style={descriptionStyle}>Tell us about your show's current performance.</p>
          <input
            type="number"
            placeholder="Episodes per month"
            value={episodesPerMonth}
            onChange={(e) => setEpisodesPerMonth(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Average downloads per episode"
            value={avgDownloads}
            onChange={(e) => setAvgDownloads(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'engagement') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headerStyle}>Audience & Guest Strategy</h2>
          <p style={descriptionStyle}>Help us understand your audience composition.</p>
          <label style={questionStyle}>Guest Seniority Level</label>
          <select
            value={guestSeniority}
            onChange={(e) => setGuestSeniority(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select guest seniority...</option>
            <option value="cLevel">C-Level (CEO, CTO, CMO)</option>
            <option value="vp">VP / Senior Manager</option>
            <option value="manager">Manager / IC</option>
          </select>

          <div style={questionStyle}>Are you interested in bringing on guests that could be customers or partners?</div>
          <div style={buttonGroupStyle}>
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
          <button style={buttonStyle} onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'costs') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headerStyle}>Deal & Cost Details</h2>
          <p style={descriptionStyle}>Help us understand your business model.</p>
          <input
            type="number"
            placeholder="Average deal size ($)"
            value={dealSize}
            onChange={(e) => setDealSize(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Sales close rate (%)"
            value={closeRate}
            onChange={(e) => setCloseRate(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Monthly podcast cost ($)"
            value={monthlyPodcastCost}
            onChange={(e) => setMonthlyPodcastCost(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={handleNext}>
            See Full Report
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'results') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <button style={exitButtonStyle} onClick={handleExit}>
            <X size={24} />
          </button>
          <h2 style={headerStyle}>Your Podcast ROI</h2>
          <p style={descriptionStyle}>Here's your projected annual impact.</p>
          
          <div style={resultStyle}>
            <div style={resultLabelStyle}>Projected Monthly Leads</div>
            <div style={resultValueStyle}>{projectedLeads}</div>
          </div>

          <div style={resultStyle}>
            <div style={resultLabelStyle}>Projected Annual Deals Closed</div>
            <div style={resultValueStyle}>{projectedDeals}</div>
          </div>

          <div style={resultStyle}>
            <div style={resultLabelStyle}>Projected Annual Pipeline Value</div>
            <div style={resultValueStyle}>${projectedPipelineValue.toLocaleString()}</div>
          </div>

          <div style={resultStyle}>
            <div style={resultLabelStyle}>Annual ROI</div>
            <div style={resultValueStyle}>{roi}x</div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={questionStyle}>Get Your Full Report</label>
            <p style={descriptionStyle}>Enter your email to see detailed insights and get a custom action plan.</p>
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
        </div>
      </div>
    );
  }

  if (currentScreen === 'thankyou') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headerStyle}>Thank You!</h2>
          <p style={descriptionStyle}>We've sent your report to {email}. Check your inbox for next steps.</p>
          <button style={buttonStyle} onClick={handleExit}>
            Calculate Again
          </button>
        </div>
      </div>
    );
  }
}
