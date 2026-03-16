import React, { useState } from 'react';
import { ChevronDown, Mail, X } from 'lucide-react';
 
export default function PodcastROICalculator() {
  const [step, setStep] = useState('calculator');
  const [episodesPerMonth, setEpisodesPerMonth] = useState(4);
  const [avgDownloads, setAvgDownloads] = useState(2000);
  const [guestSeniority, setGuestSeniority] = useState('director');
  const [dealSize, setDealSize] = useState(150000);
  const [closeRate, setCloseRate] = useState(0.15);
  const [monthlyPodcastCost, setMonthlyPodcastCost] = useState(3000);
  const [interestedInGuests, setInterestedInGuests] = useState(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
 
  const colors = {
    primary: '#ff467c',
    dark: '#2e2e2e',
    light: '#f8f1eb'
  };
 
  const seniorityMultipliers = {
    executive: 0.25,
    director: 0.18,
    manager: 0.12,
    specialist: 0.08
  };
 
  const conversationMultiplier = seniorityMultipliers[guestSeniority] || 0.15;
  const episesPerYear = episodesPerMonth * 12;
  const totalDownloadsPerYear = episesPerYear * avgDownloads;
 
  // Updated to 0.01% conversion (0.0001)
  const engagementRate = 0.0001;
  const engagedDownloads = totalDownloadsPerYear * engagementRate;
  let projectedLeads = Math.round(engagedDownloads * conversationMultiplier);
 
  // If interested in guest conversion, add 1 in 10 guests as customers
  if (interestedInGuests === 'yes') {
    const guestCustomers = Math.round(episesPerYear * 0.1);
    projectedLeads = projectedLeads + guestCustomers;
  }
 
  const projectedDeals = Math.round(projectedLeads * closeRate);
  const projectedPipelineValue = projectedDeals * dealSize;
  const annualPodcastCost = monthlyPodcastCost * 12;
  const roi = ((projectedPipelineValue - annualPodcastCost) / annualPodcastCost * 100).toFixed(0);
  const roiMultiple = (projectedPipelineValue / annualPodcastCost).toFixed(1);
 
  const handleCalculate = () => setStep('email');
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Send to Zapier webhook
      fetch('https://hooks.zapier.com/hooks/catch/5322222/upo96yz/', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          episodesPerMonth,
          avgDownloads,
          guestSeniority,
          dealSize,
          closeRate,
          monthlyPodcastCost,
          interestedInGuests,
          projectedLeads,
          projectedDeals,
          projectedPipelineValue,
          roi,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.log('Zapier submission:', err));
 
      setTimeout(() => setStep('results'), 1500);
    }
  };
  const handleStartOver = () => {
    setStep('calculator');
    setInterestedInGuests(null);
    setEmail('');
    setSubmitted(false);
  };
 
  if (step === 'results') {
    return (
      <div style={{ fontFamily: 'Figtree, sans-serif', backgroundColor: colors.light, minHeight: '100vh', padding: '24px' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap'); * { font-family: Figtree, sans-serif !important; }`}</style>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '32px' }}>
            <div style={{ display: 'inline-block', backgroundColor: colors.primary, color: 'white', padding: '8px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>
              Your Podcast ROI Report
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: colors.dark, marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>
              Your Results Are Ready
            </h1>
            <p style={{ color: colors.dark, fontSize: '18px', opacity: 0.7, fontFamily: 'Figtree, sans-serif' }}>Full report sent to {email}</p>
          </div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: 'white', border: `2px solid ${colors.primary}`, borderRadius: '12px', padding: '32px' }}>
              <div style={{ color: colors.primary, fontSize: '12px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>PROJECTED ANNUAL PIPELINE</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>
                ${(projectedPipelineValue / 1000000).toFixed(1)}M
              </div>
              <p style={{ color: colors.primary, fontSize: '13px', marginTop: '8px', fontFamily: 'Figtree, sans-serif' }}>Based on {projectedDeals} projected deals</p>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `2px solid ${colors.primary}`, borderRadius: '12px', padding: '32px' }}>
              <div style={{ color: colors.primary, fontSize: '12px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>ROI</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{roi}%</div>
              <p style={{ color: colors.primary, fontSize: '13px', marginTop: '8px', fontFamily: 'Figtree, sans-serif' }}>{roiMultiple}x return on investment</p>
            </div>
          </div>
 
          <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.dark, marginBottom: '24px', fontFamily: 'Figtree, sans-serif' }}>Your Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '24px' }}>
              <div><p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Episodes/Year</p><p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{episesPerYear}</p></div>
              <div><p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Total Downloads</p><p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{(totalDownloadsPerYear / 1000).toFixed(0)}K</p></div>
              <div><p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Projected Leads</p><p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{projectedLeads}</p></div>
              <div><p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Close Rate</p><p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{(closeRate * 100).toFixed(0)}%</p></div>
              <div><p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Annual Cost</p><p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>${(annualPodcastCost / 1000).toFixed(0)}K</p></div>
            </div>
          </div>
 
          <div style={{ backgroundColor: colors.primary, borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>Want to Hit These Numbers?</h3>
            <p style={{ color: 'white', marginBottom: '24px', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>Most B2B podcasts leave 60-70% of their revenue on the table. We systematize guest booking, distribution, and lead capture.</p>
            <button style={{ backgroundColor: 'white', color: colors.primary, fontWeight: '700', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>
              Schedule a Strategy Call
            </button>
          </div>
 
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleStartOver} style={{ color: colors.primary, fontWeight: '700', fontSize: '16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}>
              ← Calculate Another Scenario
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  if (step === 'email') {
    return (
      <div style={{ fontFamily: 'Figtree, sans-serif', backgroundColor: colors.light, minHeight: '100vh', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap'); * { font-family: Figtree, sans-serif !important; }`}</style>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '32px', position: 'relative' }}>
            <button onClick={handleStartOver} style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X style={{ width: '24px', height: '24px', color: colors.dark }} />
            </button>
 
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ backgroundColor: colors.primary, padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, textAlign: 'center', marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>Get Your Full Report</h2>
            <p style={{ color: colors.dark, textAlign: 'center', marginBottom: '32px', fontSize: '16px', opacity: 0.7, fontFamily: 'Figtree, sans-serif' }}>Enter your email to unlock your personalized podcast ROI analysis and benchmarking data.</p>
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px 16px', backgroundColor: colors.light, border: `2px solid ${colors.primary}`, borderRadius: '8px', color: colors.dark, fontSize: '16px', fontFamily: 'Figtree, sans-serif', outline: 'none' }} />
              <button type="submit" disabled={submitted} style={{ backgroundColor: colors.primary, color: 'white', fontWeight: '700', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: submitted ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: submitted ? 0.7 : 1, fontFamily: 'Figtree, sans-serif' }}>
                {submitted ? 'Sending...' : 'Unlock Full Report'}
              </button>
            </form>
            <p style={{ color: colors.dark, fontSize: '12px', textAlign: 'center', marginTop: '24px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>We'll send your complete analysis and keep you updated on podcast growth trends.</p>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div style={{ fontFamily: 'Figtree, sans-serif', backgroundColor: colors.light, minHeight: '100vh', padding: '24px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap'); * { font-family: Figtree, sans-serif !important; } input[type="range"] { accent-color: ${colors.primary}; }`}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '32px' }}>
          <div style={{ display: 'inline-block', backgroundColor: colors.primary, color: 'white', padding: '8px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>
            B2B Podcast ROI Calculator
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: colors.dark, marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>Will Your B2B Podcast Make Money?</h1>
          <p style={{ color: colors.dark, fontSize: '18px', maxWidth: '600px', margin: '0 auto', opacity: 0.7, fontFamily: 'Figtree, sans-serif' }}>Calculate your projected revenue impact and pipeline value based on your show's strategy, metrics and cadence</p>
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>Episodes Per Month</label>
                <span style={{ fontSize: '32px', fontWeight: '800', color: colors.primary, fontFamily: 'Figtree, sans-serif' }}>{episodesPerMonth}</span>
              </div>
              <input type="range" min="1" max="12" value={episodesPerMonth} onChange={(e) => setEpisodesPerMonth(parseInt(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none' }} />
              <p style={{ color: colors.dark, fontSize: '13px', marginTop: '12px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Industry average: 2-4 episodes/month</p>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>Avg. Downloads Per Episode</label>
                <span style={{ fontSize: '32px', fontWeight: '800', color: colors.primary, fontFamily: 'Figtree, sans-serif' }}>{avgDownloads.toLocaleString()}</span>
              </div>
              <input type="range" min="500" max="50000" step="500" value={avgDownloads} onChange={(e) => setAvgDownloads(parseInt(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none' }} />
              <p style={{ color: colors.dark, fontSize: '13px', marginTop: '12px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>B2B avg: 1.5K-3K (early); 5K-15K (mature)</p>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', display: 'block', marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>Typical Guest Seniority</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'executive', label: 'C-Suite', desc: '25% conversion' },
                  { value: 'director', label: 'Director/VP', desc: '18% conversion' },
                  { value: 'manager', label: 'Manager', desc: '12% conversion' },
                  { value: 'specialist', label: 'IC', desc: '8% conversion' }
                ].map(opt => (
                  <button key={opt.value} onClick={() => setGuestSeniority(opt.value)} style={{ padding: '12px', borderRadius: '8px', border: `2px solid ${guestSeniority === opt.value ? colors.primary : colors.light}`, backgroundColor: guestSeniority === opt.value ? colors.light : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Figtree, sans-serif' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: colors.dark, marginTop: '4px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', display: 'block', marginBottom: '16px', fontFamily: 'Figtree, sans-serif' }}>Are you interested in bringing on guests that could be customers or partners?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ].map(opt => (
                  <button key={opt.value} onClick={() => setInterestedInGuests(opt.value)} style={{ padding: '12px', borderRadius: '8px', border: `2px solid ${interestedInGuests === opt.value ? colors.primary : colors.light}`, backgroundColor: interestedInGuests === opt.value ? colors.light : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'Figtree, sans-serif', fontWeight: '600', color: colors.dark' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {interestedInGuests === 'yes' && <p style={{ color: colors.primary, fontSize: '13px', marginTop: '12px', fontFamily: 'Figtree, sans-serif' }}>We're assuming 1 in 10 guests converts to a customer or partner</p>}
            </div>
 
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>Avg. Deal Size (ACV)</label>
                <span style={{ fontSize: '32px', fontWeight: '800', color: colors.primary, fontFamily: 'Figtree, sans-serif' }}>${(dealSize / 1000).toFixed(0)}K</span>
              </div>
              <input type="range" min="25000" max="500000" step="25000" value={dealSize} onChange={(e) => setDealSize(parseInt(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none' }} />
              <p style={{ color: colors.dark, fontSize: '13px', marginTop: '12px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>B2B SaaS typical: $50K-$250K ACV</p>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>Close Rate (from leads)</label>
                <span style={{ fontSize: '32px', fontWeight: '800', color: colors.primary, fontFamily: 'Figtree, sans-serif' }}>{(closeRate * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0.05" max="0.5" step="0.01" value={closeRate} onChange={(e) => setCloseRate(parseFloat(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none' }} />
              <p style={{ color: colors.dark, fontSize: '13px', marginTop: '12px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Industry benchmark: 10-20%</p>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ color: colors.dark, fontWeight: '700', fontSize: '16px', fontFamily: 'Figtree, sans-serif' }}>Monthly Podcast Cost</label>
                <span style={{ fontSize: '32px', fontWeight: '800', color: colors.primary, fontFamily: 'Figtree, sans-serif' }}>${(monthlyPodcastCost / 1000).toFixed(1)}K</span>
              </div>
              <input type="range" min="500" max="20000" step="500" value={monthlyPodcastCost} onChange={(e) => setMonthlyPodcastCost(parseInt(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none' }} />
              <p style={{ color: colors.dark, fontSize: '13px', marginTop: '12px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Includes production, editing, distribution</p>
            </div>
          </div>
 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: colors.primary, borderRadius: '12px', padding: '24px', color: 'white' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9, fontFamily: 'Figtree, sans-serif' }}>Projected Annual Pipeline</p>
              <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>
                {projectedPipelineValue >= 1000000 ? `$${(projectedPipelineValue / 1000000).toFixed(1)}M` : `$${(projectedPipelineValue / 1000).toFixed(0)}K`}
              </div>
              <div style={{ height: '2px', backgroundColor: 'white', borderRadius: '1px', marginBottom: '16px', width: '48px', opacity: 0.5 }}></div>
              <div><div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9, fontFamily: 'Figtree, sans-serif' }}>From {projectedDeals} deals</div><div style={{ fontSize: '14px', opacity: 0.9, fontFamily: 'Figtree, sans-serif' }}>Cost: ${(annualPodcastCost / 1000).toFixed(0)}K/year</div></div>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `2px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <p style={{ color: colors.primary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>Return on Investment</p>
              <div style={{ fontSize: '40px', fontWeight: '800', color: colors.dark, marginBottom: '4px', fontFamily: 'Figtree, sans-serif' }}>{roi}%</div>
              <p style={{ color: colors.primary, fontSize: '14px', fontFamily: 'Figtree, sans-serif' }}>{roiMultiple}x multiple on investment</p>
            </div>
 
            <div style={{ backgroundColor: 'white', border: `2px solid ${colors.primary}`, borderRadius: '12px', padding: '24px' }}>
              <p style={{ color: colors.primary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Figtree, sans-serif' }}>Projected Leads</p>
              <div style={{ fontSize: '40px', fontWeight: '800', color: colors.dark, fontFamily: 'Figtree, sans-serif' }}>{projectedLeads}</div>
              <p style={{ color: colors.primary, fontSize: '14px', marginTop: '4px', fontFamily: 'Figtree, sans-serif' }}>Annual qualified conversations</p>
            </div>
 
            <button onClick={() => interestedInGuests !== null ? handleCalculate() : alert('Please answer the guest question above')} style={{ backgroundColor: colors.primary, color: 'white', fontWeight: '800', padding: '16px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '24px', fontSize: '16px', transition: 'transform 0.2s', fontFamily: 'Figtree, sans-serif' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>See Full Report</span>
                <ChevronDown style={{ width: '16px', height: '16px' }} />
              </div>
            </button>
 
            <p style={{ color: colors.dark, fontSize: '12px', textAlign: 'center', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Get detailed benchmarks and next steps</p>
          </div>
        </div>
 
        <div style={{ backgroundColor: 'white', border: `1px solid ${colors.primary}`, borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: colors.dark, marginBottom: '16px', opacity: 0.7, fontFamily: 'Figtree, sans-serif' }}>These projections are based on industry benchmarks for B2B podcast lead generation. Your actual results may vary based on content quality, guest caliber, and promotion strategy.</p>
          <p style={{ color: colors.dark, fontSize: '14px', opacity: 0.6, fontFamily: 'Figtree, sans-serif' }}>Made by <span style={{ fontWeight: '800', color: colors.primary }}>Fame</span> — B2B Podcast Growth Agency</p>
        </div>
      </div>
    </div>
  );
}