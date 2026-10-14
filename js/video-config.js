// Set youtubeId to the final 11-character video ID when each guide is ready.
// Until then, the card opens a local, clearly labelled interactive demo.
export const videos = {
  choose: {
    title: 'Choose the right kit',
    youtubeId: null,
    steps: [
      {
        title: 'Start with the role you want.',
        copy: 'For analytics and business decisions, explore Data Analyst. For statistics, model building and Gen AI, start with Data Scientist.',
      },
      {
        title: 'Match the kit to your focus.',
        copy: 'ML Engineer focuses on machine learning and deployment. The All-in-One Combo connects Data Science, Gen AI and ML Engineering.',
      },
      {
        title: 'Explore before you decide.',
        copy: 'Use the career selector, read your recommended kit overview and take a look at the handbook, practice workbook and solution manual.',
      },
    ],
  },
  use: {
    title: 'How to use your kit',
    youtubeId: null,
    steps: [
      {
        title: '01. Learn the concept.',
        copy: 'Choose one topic in the handbook. Read the explanation, work through the examples and note anything you want to revisit.',
      },
      {
        title: '02. Try it yourself.',
        copy: 'Open the matching practice workbook. Attempt the questions before looking at the answers. Explain your approach in your own words.',
      },
      {
        title: '03. Review and repeat.',
        copy: 'Compare your approach with the solution manual. Understand the reasoning, revisit gaps and continue to the next topic at your pace.',
      },
    ],
  },
};
