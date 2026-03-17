// Blog resources mapped to calculator levers
// These URLs are stored centrally so they can be used consistently
// across the calculator, report page, and PDF

export const blogResources = {
  'Average Downloads': {
    title: 'How to Promote a Podcast',
    url: 'https://www.fame.so/post/how-to-promote-a-podcast',
    description: 'Learn proven strategies to increase your episode downloads and grow your audience reach.'
  },
  'Guest Strategy': {
    withGuests: {
      title: 'How to Find Podcast Guests',
      url: 'https://www.bcast.fm/blog/how-to-find-podcast-guests',
      description: 'Discover how to systematically attract and book high-value guests.'
    },
    withoutGuests: {
      title: 'B2B Podcast ROI: Guest & Listener Conversion',
      url: 'https://www.fame.so/post/b2b-podcast-roi-guest-listener-conversion',
      description: 'Learn why developing a guest strategy significantly improves your podcast ROI.'
    }
  },
  'Monthly Podcast Cost': {
    title: 'B2B Podcast Agency ROI',
    url: 'https://www.fame.so/post/b2b-podcast-agency-roi',
    description: 'Find a quality, cost-effective agency partner to optimize your podcast production.'
  },
  'Sales Close Rate': {
    title: 'Podcast ROI Playbook',
    url: 'https://www.fame.so/post/podcast-roi-playbook',
    description: 'Master the strategies to convert podcast listeners into high-value deals.'
  },
  'Episodes Per Month': {
    title: 'How to Find Podcast Guests',
    url: 'https://www.bcast.fm/blog/how-to-find-podcast-guests',
    description: 'Increase publishing frequency with a systematic guest booking strategy.'
  },
  'Deal Size': {
    title: 'Podcast ROI Playbook',
    url: 'https://www.fame.so/post/podcast-roi-playbook',
    description: 'Build authority and convert listeners into larger, higher-value deals.'
  }
};

export const getResourceForLever = (leverName, interestedInGuests = true) => {
  const resource = blogResources[leverName];

  // Handle conditional Guest Strategy resource
  if (leverName === 'Guest Strategy' && resource) {
    return interestedInGuests ? resource.withGuests : resource.withoutGuests;
  }

  return resource || null;
};
