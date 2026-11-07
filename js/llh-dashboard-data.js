// Illustrative presentation data only. Never use it for access or entitlement decisions.
export const sampleProgress = Object.freeze({
  isSample: true,
  chaptersCompleted: 31,
  chaptersTotal: 50,
  activity: Object.freeze([
    Object.freeze({ day: 'Monday', short: 'M', minutes: 20 }),
    Object.freeze({ day: 'Tuesday', short: 'T', minutes: 35 }),
    Object.freeze({ day: 'Wednesday', short: 'W', minutes: 0 }),
    Object.freeze({ day: 'Thursday', short: 'T', minutes: 25 }),
    Object.freeze({ day: 'Friday', short: 'F', minutes: 40 }),
    Object.freeze({ day: 'Saturday', short: 'S', minutes: 0 }),
    Object.freeze({ day: 'Sunday', short: 'S', minutes: 0 }),
  ]),
});

export const dashboardFeatures = Object.freeze([
  Object.freeze({ id: 'library', title: 'My Library', description: 'Your purchased kits and learning resources, organised in one place.', icon: 'library', label: 'YOUR RESOURCES', status: 'In development', accent: 'lavender' }),
  Object.freeze({ id: 'study', title: 'Study Tracker', description: 'Build momentum, one subject and one chapter at a time.', icon: 'study', label: 'YOUR PREPARATION', status: 'In development', accent: 'sage' }),
  Object.freeze({ id: 'interview', title: '7-Day Interview Readiness', description: 'A focused path through curated, high-priority interview questions.', icon: 'interview', label: 'YOUR NEXT OPPORTUNITY', status: 'In development', accent: 'peach' }),
  Object.freeze({ id: 'career', title: 'Career Tracker', description: 'Bring your skills, goals and next career move into focus.', icon: 'career', label: 'YOUR DIRECTION', status: 'Coming soon', accent: 'blue' }),
]);
