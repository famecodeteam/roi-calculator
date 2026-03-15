import React, { useState } from 'react';
import { ChevronDown, TrendingUp, Target, DollarSign, Mail } from 'lucide-react';

export default function PodcastROICalculator() {
  const [step, setStep] = useState('calculator'); // 'calculator' or 'email'

  // Input states
  const [episodesPerMonth, setEpisodesPerMonth] = useState(4);
  const [avgDownloads, setAvgDownloads] = useState(2000);
  const [guestSeniority, setGuestSeniority] = useState('director');
  const [dealSize, setDealSize] = useState(150000);
  const [avgSalesCycle, setAvgSalesCycle] = useState(90);
  const [closeRate, setCloseRate] = useState(0.15);
  const [monthlyPodcastCost, setMonthlyPodcastCost] = useState(3000);

  // Email state
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Brand colors
  const colors = {
    primary: '#ff467c',      // Pink
    dark: '#2e2e2e',         // Dark gray
    light: '#f8f1eb',        // Cream
  };

  // Seniority multipliers (affect conversion likelihood)
  const seniorityMultipliers = {
    executive: 0.25,
    director: 0.18,
    manager: 0.12,
    specialist: 0.08
  };

  // Calculate metrics
  const conversationMultiplier = seniorityMultipliers[guestSeniority] || 0.15;
  const episesPerYear = episodesPerMonth * 12;
  const totalDownloadsPerYear = episesPerYear * avgDownloads;

  // Industry benchmark: 5-10% of downloads lead to meaningful engagement
  // Of those, a % convert based on guest seniority
  const engagementRate = 0.075; // 7.5% industry average
  const engagedDownloads = totalDownloadsPerYear * engagementRate;
  const projectedLeads = Math.round(engagedDownloads * conversationMultiplier);
  const projectedDeals = Math.round(projectedLeads * closeRate);
  const projectedPipelineValue = projectedDeals * dealSize;

  const annualPodcastCost = monthlyPodcastCost * 12;
  const roi = ((projectedPipelineValue - annualPodcastCost) / annualPodcastCost * 100).toFixed(0);
  const roiMultiple = (projectedPipelineValue / annualPodcastCost).toFixed(1);

  const handleCalculate = () => {
    setStep('email');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // In production, send to your email service here
      console.log('Email submitted:', email);
      setTimeout(() => {
        setStep('results');
      }, 1500);
    }
  };

  const handleStartOver = () => {
    setStep('calculator');
    setEmail('');
    setSubmitted(false);
  };

  // Results view
  if (step === 'results') {
    return (
      <div style={{ fontFamily: 'Figtree, sans-serif', backgroundColor: colors.light, minHeight: '100vh', padding: '24px' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');
          * { font-family: Figtree, sans-serif; }
        `}</style>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '32px' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: colors.primary,
              color: 'white',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '16px',
              letterSpacing: '0.05em'
            }}>
              Your Podcast ROI Report
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: colors.dark, marginBottom: '8px' }}>
              Your Results Are Ready
            </h1>
            <p style={{ color: colors.dark, fontSize: '18px', opacity: 0.7 }}>
              Full report sent to {email}
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Pipeline Value */}
            <div style={{
              backgroundColor: 'white',
              border: `2px solid ${colors.primary}`,
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: colors.primary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projected Annual Pipeline
                </span>
                <DollarSign style={{ width: '20px', height: '20px', color: colors.primary }} />
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: colors.dark }}>
                ${(projectedPipelineValue / 1000000).toFixed(1)}M
              </div>
              <p style={{ color: colors.primary, fontSize: '13px', marginTop: '8px', opacity: 0.8 }}>
                Based on {projectedDeals} projected deals
              </p>
            </div>

            {/* ROI */}
            <div style={{
              backgroundColor: 'white',
              border: `2px solid ${colors.primary}`,
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: colors.primary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ROI
                </span>
                <TrendingUp style={{ width: '20px', height: '20px', color: colors.primary }} />
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: colors.dark }}>
                {roi}%
              </div>
              <p style={{ color: colors.primary, fontSize: '13px', marginTop: '8px', opacity: 0.8 }}>
                {roiMultiple}x return on investment
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div style={{
            backgroundColor: 'white',
            border: `1px solid ${colors.primary}`,
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.dark, marginBottom: '24px' }}>
              Your Metrics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '24px' }}>
              <div>
                <p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6 }}>
                  Episodes/Year
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark }}>
                  {episesPerYear}
                </p>
              </div>
              <div>
                <p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6 }}>
                  Total Downloads
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark }}>
                  {(totalDownloadsPerYear / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6 }}>
                  Projected Leads
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark }}>
                  {projectedLeads}
                </p>
              </div>
              <div>
                <p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6 }}>
                  Guest Seniority
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark, textTransform: 'capitalize' }}>
                  {guestSeniority}
                </p>
              </div>
              <div>
                <p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6 }}>
                  Close Rate
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark }}>
                  {(closeRate * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p style={{ color: colors.dark, fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.6 }}>
                  Annual Cost
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: colors.dark }}>
                  ${(annualPodcastCost / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            backgroundColor: colors