// Blog resources mapped to calculator levers
// These URLs are stored centrally so they can be used consistently
// across the calculator, report page, and PDF

export const blogResources = {
  'Average Downloads': {
    title: 'How to Promote a Podcast - The Ultimate Guide',
    url: 'https://www.fame.so/blog/how-to-promote-a-podcast',
    description: 'Learn proven strategies to increase your episode downloads and grow your audience reach.'
  },
  'Guest Strategy': {
    title: 'How to Build Credibility With a B2B Podcast',
    url: 'https://www.fame.so/blog/how-to-build-credibility-with-a-b2b-podcast',
    description: 'Discover how to establish authority and attract high-value guests to amplify your impact.'
  },
  'Monthly Podcast Cost': {
    title: 'How to reduce customer acquisition cost: Practical strategies for 2026 growth',
    url: 'https://www.fame.so/blog/how-to-reduce-customer-acquisition-cost',
    description: 'Find cost-efficient strategies to optimize your podcast production and maximize ROI.'
  },
  'Sales Close Rate': {
    title: 'What Is Strategic Positioning And How To Master It In B2B',
    url: 'https://www.fame.so/blog/strategic-positioning-b2b',
    description: 'Master positioning to strengthen your sales process and close deals more effectively.'
  },
  'Episodes Per Month': {
    title: 'How to Promote a Podcast - The Ultimate Guide',
    url: 'https://www.fame.so/blog/how-to-promote-a-podcast',
    description: 'Optimize your content strategy to maximize reach and engagement with consistent publishing.'
  },
  'Deal Size': {
    title: 'What Is Strategic Positioning And How To Master It In B2B',
    url: 'https://www.fame.so/blog/strategic-positioning-b2b',
    description: 'Build authority and credibility to command higher-value deals.'
  }
};

export const getResourceForLever = (leverName) => {
  return blogResources[leverName] || null;
};
