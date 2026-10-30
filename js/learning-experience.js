// Visual learning previews; authentication is handled independently by llh.html.
export const learningExperienceContent = {
  complete: {
  "hero": "One organised path across Data Science, Gen AI and ML Engineering — with the Data Analytics kit included.",
  "eyebrow": "YOUR COMPLETE LEARNING JOURNEY",
  "title": "Connect Your Skills. Plan Your Next Step.",
  "description": "Organise your preparation from core data skills to LLM applications, model deployment and business communication.",
  "subjects": [
    "Data Science",
    "Gen AI",
    "MLOps",
    "Deep Learning",
    "Analytics",
    "Storytelling"
  ],
  "chapter": "Python · Chapter 03",
  "currentPath": "Data Scientist",
  "nextPath": "ML / GenAI Engineer",
  "nextSkills": [
    "LLM apps",
    "Model serving",
    "Communication"
  ],
  "toolkitTitle": "Explain the Whole Project, From Data to Impact.",
  "toolkitDescription": "Connect your technical decisions with clear outcomes — from analysis and modelling to deployment and business value.",
  "toolkitBenefits": [
    "Data & modelling",
    "LLM applications",
    "Production trade-offs",
    "Business impact"
  ],
  "project": {
    "title": "Customer support assistant",
    "rows": [
      "Reduce repetitive support requests",
      "Retrieve context · evaluate responses",
      "Python · LLMs · retrieval",
      "Measure answer quality · monitor service",
      "Help teams resolve queries faster"
    ],
    "prompt": "How would you evaluate this system and explain its business value?"
  }
},
  engineer: {
  "hero": "Prepare beyond the notebook — organise your learning, track your progress and build towards ML engineering.",
  "eyebrow": "YOUR MACHINE LEARNING JOURNEY",
  "title": "Build Your Path From Models to Production.",
  "description": "Organise your preparation across ML foundations, model evaluation, deep learning and MLOps.",
  "subjects": [
    "Math & Stats",
    "Python",
    "EDA",
    "Machine Learning",
    "Deep Learning",
    "MLOps"
  ],
  "chapter": "Python · Chapter 03",
  "currentPath": "ML Engineer",
  "nextPath": "ML Platform Engineer",
  "nextSkills": [
    "ML pipelines",
    "Model serving",
    "Monitoring"
  ],
  "toolkitTitle": "Build Models. Explain Your Engineering Decisions.",
  "toolkitDescription": "Explain your model choices, evaluation strategy and deployment decisions clearly in interviews.",
  "toolkitBenefits": [
    "Feature engineering",
    "Model evaluation",
    "Deployment decisions",
    "Production trade-offs"
  ],
  "project": {
    "title": "Customer churn prediction pipeline",
    "rows": [
      "Identify customers at risk",
      "Engineer features · compare models",
      "Python · scikit-learn",
      "Validate recall · monitor model drift",
      "Prioritise retention outreach"
    ],
    "prompt": "How would you deploy and monitor this model?"
  }
},
  home: {
    heroHeading: 'More Than Interview PDFs. A Structured Learning Experience.',
    hero: 'Learn concepts, practise interview questions, track your preparation and plan your career with LearnLytics.',
    eyebrow: 'INTRODUCING LEARNLYTICS LEARNING HUB',
    title: 'More Than a PDF Bundle. A Complete Learning Management Experience.',
    description: 'Access your kit, track your preparation and plan your next career move — all in one organised learning experience.',
    subjects: ['SQL', 'Python', 'Statistics'],
    chapter: 'SQL · Chapter 03',
    currentPath: 'Data Analyst',
    nextPath: 'Analytics Engineer',
    nextSkills: ['Data modelling', 'dbt', 'Pipelines'],
    toolkitTitle: 'Project Explanation Toolkit',
    toolkitDescription: 'From building real-world projects to confidently defending your technical decisions in interviews.',
    toolkitBenefits: ['Build', 'Improve', 'Explain', 'Defend'],
    project: {
      title: 'Sales performance analysis',
      rows: ['Understand declining sales', 'Explore trends by segment', 'SQL · Python · Power BI', 'Explain dashboard insights', 'Support business decisions'],
      prompt: 'Why did you choose this approach?',
    },
  },
  analyst: {
    hero: 'More than study material — structured preparation, chapter-wise progress tracking and career guidance.',
    eyebrow: 'YOUR PREPARATION, ORGANISED',
    title: 'Track Your Data Analyst Preparation Clearly.',
    description: 'Organise your handbook progress, warmup tests and interviewer tests in one structured workflow.',
    subjects: ['SQL', 'Excel', 'Python', 'Statistics', 'BI', 'Storytelling'],
    chapter: 'SQL · Chapter 03',
    currentPath: 'Data Analyst',
    nextPath: 'Analytics Engineer',
    nextSkills: ['Data modelling', 'dbt', 'Pipelines'],
    trackerNote: 'Planned: 80 handbook chapters.',
    toolkitTitle: 'Explain Your Analytics Projects With Confidence.',
    toolkitDescription: 'Present your work clearly — from business problem and SQL analysis to dashboard insights and results.',
    toolkitBenefits: ['SQL & Python analysis', 'BI dashboards', 'Business impact', 'Stakeholder questions'],
    project: {
      title: 'Sales performance analysis',
      rows: ['Understand declining sales', 'Explore trends by segment', 'SQL · Python · Power BI', 'Explain dashboard insights', 'Support business decisions'],
      prompt: 'How would you explain this to a stakeholder?',
    },
  },
  scientist: {
    hero: 'Go beyond handbooks with structured learning, preparation tracking and career-focused guidance.',
    eyebrow: 'YOUR DATA SCIENCE LEARNING JOURNEY',
    title: 'Structure Your Data Science Learning Journey.',
    description: 'Track chapters, test progress and next-step career paths across Data Science and GenAI preparation.',
    subjects: ['Math & Stats', 'Python', 'EDA', 'Machine Learning', 'Deep Learning', 'GenAI / LLMs'],
    chapter: 'Python · Chapter 03',
    currentPath: 'Data Scientist',
    nextPath: 'ML / GenAI Engineer',
    nextSkills: ['ML pipelines', 'Deployment', 'LLM apps'],
    trackerNote: 'Planned: 140 handbook chapters.',
    toolkitTitle: 'Build Projects. Explain Every Decision.',
    toolkitDescription: 'Learn to explain your models, workflows, results and technical choices confidently in interviews.',
    toolkitBenefits: ['ML pipelines', 'Model evaluation', 'GenAI use cases', 'Technical trade-offs'],
    project: {
      title: 'Customer churn prediction',
      rows: ['Find customers at risk', 'Engineer features · compare models', 'Python · scikit-learn', 'Evaluate recall & precision', 'Prioritise retention outreach'],
      prompt: 'Why this model, and how did you evaluate it?',
    },
  },
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const icon = name => `<svg class="icon" aria-hidden="true"><use href="assets/icons/product.svg#${name}" /></svg>`;
const features = [['book', 'My Learning Library'], ['solution', 'Study Preparation Tracker'], ['target', 'Career Preparation Tracker']];

export function renderHubPreview(content, view) {
  const kits = view === 'home' ? ['Data Analyst Kit', 'Data Scientist & GenAI Kit']
    : [{ analyst: 'Data Analyst Kit', scientist: 'Data Scientist & GenAI Kit', engineer: 'Machine Learning Engineer Kit', complete: 'Data Science + Gen AI + ML Engineer Kit' }[view]];
  return `<figure class="hub-preview" aria-label="LearnLytics Learning Hub preview">
    <div class="hub-preview-window">
      <div class="hub-preview-header">
        <span class="hub-preview-brand">${icon('book')}<strong>LearnLytics Learning Hub</strong></span>
      </div>
      <div class="hub-preview-body">
        <div class="hub-preview-library hub-preview-panel">
          <h3>${icon('book')}My Library</h3>
          ${kits.map((kit, index) => `<div class="hub-library-row">
            <span class="hub-kit-cover">${icon(index ? 'layers' : 'book')}</span>
            <div><strong>${escapeHtml(kit)}</strong>${index === 0 ? '<small>Handbook · Workbook · Solutions</small>' : ''}</div>
            <span class="hub-preview-action">View resources ${icon('arrow')}</span>
          </div>`).join('')}
        </div>
        <div class="hub-preview-study hub-preview-panel">
          <h3>${icon('solution')}Study Tracker<span class="hub-example-label">EXAMPLE</span></h3>
          <ul class="hub-subjects" aria-label="Example study subjects">${content.subjects.map(subject => `<li>${escapeHtml(subject)}</li>`).join('')}</ul>
          <div class="hub-chapter"><strong>${escapeHtml(content.chapter)}</strong><span>Chapter preparation</span></div>
          <ol class="hub-study-steps" aria-label="Illustrative chapter progress">
            <li class="is-complete"><span class="hub-step-symbol">${icon('check')}</span><strong>Handbook</strong><span class="hub-progress-track" aria-hidden="true"><i></i></span><small>Completed</small></li>
            <li class="is-current"><span class="hub-step-symbol">${icon('clock')}</span><strong>Warmup Test</strong><span class="hub-progress-track" aria-hidden="true"><i></i></span><small>In progress</small></li>
            <li><span class="hub-step-symbol">${icon('solution')}</span><strong>Interviewer Test</strong><span class="hub-progress-track" aria-hidden="true"><i></i></span><small>Up next</small></li>
          </ol>
        </div>
        <div class="hub-preview-career hub-preview-panel">
          <h3>${icon('target')}Career Tracker</h3>
          <ol class="hub-career-path" aria-label="Example career direction">
            <li><small>Current path</small><strong>${escapeHtml(content.currentPath)}</strong></li>
            <li><small>Explore next</small><strong>${escapeHtml(content.nextPath)}</strong></li>
          </ol>
          <div class="hub-next-skills"><span>Next skills to build</span><ul>${content.nextSkills.map(skill => `<li>${escapeHtml(skill)}</li>`).join('')}</ul></div>
        </div>
      </div>
    </div>
    <figcaption>Concept preview · Illustrative progress</figcaption>
  </figure>`;
}

function renderToolkitPreview(project) {
  const labels = ['Problem', 'Approach', 'Tools used', 'Outcome', 'Business impact'];
  return `<figure class="toolkit-preview" aria-label="Example Project Explanation Toolkit framework">
    <div class="toolkit-story">
      <div class="toolkit-story-header"><span>${icon('workbook')}PROJECT STORY</span><span>EXAMPLE</span></div>
      <h3>${escapeHtml(project.title)}</h3>
      <dl class="toolkit-story-rows">${labels.map((label, index) => `<div><dt><span aria-hidden="true">0${index + 1}</span>${label}</dt><dd>${escapeHtml(project.rows[index])}</dd></div>`).join('')}</dl>
    </div>
    <div class="toolkit-interviewer"><span class="toolkit-prompt-label">${icon('headset')}INTERVIEWER PROMPT</span><p>“${escapeHtml(project.prompt)}”</p></div>
    <div class="toolkit-answer"><span>YOUR ANSWER FRAMEWORK</span><ol><li>Situation</li><li>Method</li><li>Decision</li><li>Result</li></ol></div>
    <figcaption>Project Explanation Toolkit preview</figcaption>
  </figure>`;
}

const toolkitArtwork = {
  "analyst": {
    "file": "assets/images/da-toolkit-theme-20261019.webp",
    "width": 1122,
    "height": 1402
  },
  "engineer": {
    "file": "assets/images/ml-toolkit-theme-20261019.webp",
    "width": 1122,
    "height": 1402
  },
  "scientist": {
    "file": "assets/images/ds-toolkit-theme-20261019.webp",
    "width": 1122,
    "height": 1402
  }
};

// Counts and publication status belong to each career edition.
const toolkitEditions = [
  { code: 'DA', title: 'Data Analyst', projects: 10, chapters: 16, status: 'Content ready', note: 'Publication pending' },
  { code: 'AE', title: 'Analytics Engineer', focus: 'Data modelling · SQL · dbt', status: 'In development' },
  { code: 'DS', title: 'Data Scientist', focus: 'Statistics · ML · GenAI', status: 'Coming soon' },
  { code: 'ML', title: 'Machine Learning Engineer', focus: 'Models · MLOps · Deployment', status: 'Coming soon' },
];

function renderToolkitParts() {
  return `<div class="toolkit-parts">
    <section class="toolkit-part" aria-labelledby="toolkit-lab-title">
      <p class="eyebrow">PART 01 <span class="learning-status">Free resource</span></p>
      <h3 id="toolkit-lab-title">LearnLytics Curated Project Lab</h3>
      <ul class="toolkit-part-features">
        <li>10 curated projects with original creator credits.</li>
        <li>Beginner, Intermediate and Advanced levels.</li>
        <li>Project improvement challenges and interview preparation.</li>
      </ul>
    </section>
    <section class="toolkit-part" aria-labelledby="toolkit-defense-title">
      <p class="eyebrow">PART 02 <span class="learning-status">Premium resource</span></p>
      <h3 id="toolkit-defense-title">Project Explanation &amp; Interview Defense</h3>
      <p class="toolkit-part-access">Included with eligible Interview Kits.</p>
      <ul class="toolkit-part-features">
        <li>Project explanations and technical decisions.</li>
        <li>Interview questions and mock practice.</li>
        <li>Chapter counts vary by career edition.</li>
      </ul>
    </section>
  </div>`;
}

function renderToolkitEditions() {
  return `<section class="toolkit-editions" aria-labelledby="toolkit-editions-title">
    <h3 id="toolkit-editions-title">Choose your career path</h3>
    <ul class="toolkit-edition-grid" role="list">
      ${toolkitEditions.map(edition => `<li class="toolkit-edition">
        <span class="learning-toolkit-icon toolkit-edition-code">${escapeHtml(edition.code)}</span>
        <h4>${escapeHtml(edition.title)}</h4>
        <p class="toolkit-edition-detail">${edition.projects != null && edition.chapters != null
          ? `${edition.projects} projects · ${edition.chapters} chapters`
          : escapeHtml(edition.focus)}</p>
        <div class="toolkit-edition-availability">
          <span class="learning-status">${escapeHtml(edition.status)}</span>
          ${edition.note ? `<p>${escapeHtml(edition.note)}</p>` : ''}
        </div>
      </li>`).join('')}
    </ul>
  </section>`;
}

const toolkitPages = {
  analyst: { href: 'project-da', view: 'project' },
  scientist: { href: 'project-ds', view: 'project-ds' },
  engineer: { href: 'project-ml', view: 'project-ml' },
};

export function setupLearningExperience(view) {
  const toolkitPage = toolkitPages[view];
  const artwork = toolkitArtwork[view] || { file: "assets/images/project-explanation-toolkit.webp", width: 800, height: 1000 };
  const content = learningExperienceContent[view];
  const slot = document.querySelector(`[data-learning-experience="${view}"]`);
  if (!content || !slot || slot.childElementCount) return;
  const hero = document.querySelector('[data-learning-hero]');
  if (hero) hero.innerHTML = `${content.heroHeading ? `<strong>${escapeHtml(content.heroHeading)}</strong>` : ''}
    <span>${escapeHtml(content.hero)}</span>`;

  slot.innerHTML = `
    <section class="learning-hub" id="learning-hub" aria-labelledby="learning-hub-title">
      <div class="learning-hub-overview">
        <div class="learning-hub-intro">
          <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
          <h2 id="learning-hub-title">${escapeHtml(content.title)}</h2>
          <p class="learning-hub-description">${escapeHtml(content.description)}</p>
          <ul class="learning-hub-features" aria-label="Planned Learning Hub features">
            ${features.map(([symbol, title]) => `<li><span class="learning-feature-icon">${icon(symbol)}</span><span>${escapeHtml(title)}</span></li>`).join('')}
          </ul>
          ${content.trackerNote ? `<p class="learning-tracker-note">${escapeHtml(content.trackerNote)}</p>` : ''}
        </div>
        ${renderHubPreview(content, view)}
      </div>
      <div class="learning-hub-footer">
        <a class="text-button" href="learnlytics-learning-hub">Open My Library ${icon('arrow')}</a>
      </div>
      <!-- Future dedicated explainer: insert a responsive video after this footer. -->
    </section>
    <section class="learning-toolkit" aria-labelledby="learning-toolkit-title">
      <div class="learning-toolkit-copy">
        <div class="learning-toolkit-label"><span class="learning-toolkit-icon">${icon('workbook')}</span></div>
        <p class="eyebrow">${view === 'home' ? 'MAKE YOUR NEXT INTERVIEW COUNT' : 'PROJECT EXPLANATION TOOLKIT'}</p>
        <h2 id="learning-toolkit-title">${toolkitPage ? `<a class="toolkit-card-link" href="${toolkitPage.href}" data-view="${toolkitPage.view}">${escapeHtml(content.toolkitTitle)}</a>` : escapeHtml(content.toolkitTitle)}</h2>
        <p class="learning-toolkit-description">${escapeHtml(content.toolkitDescription)}</p>
        <ul class="learning-toolkit-benefits">${content.toolkitBenefits.map(benefit => `<li>${escapeHtml(benefit)}</li>`).join('')}</ul>
      </div>
      ${view === 'home' ? renderToolkitParts() : ''}
      <div class="learning-toolkit-visuals">
        <figure class="toolkit-product">
          <img src="${escapeHtml(artwork.file)}" width="${artwork.width}" height="${artwork.height}" loading="lazy" decoding="async" alt="LearnLytics Project Explanation Toolkit book with a Problem, Approach, Decision and Result worksheet" />
          <figcaption><h3>How To Explain Your Projects Confidently In Interview</h3><p>This Toolkit Is Answer</p></figcaption>
        </figure>
        ${renderToolkitPreview(content.project)}
      </div>
      ${view === 'home' ? renderToolkitEditions() : ''}
    </section>`;

  // Only the homepage Hub moves above the guide videos; its Toolkit stays later.
  const hubSlot = view === 'home' && document.querySelector('[data-learning-hub-slot]');
  if (hubSlot) hubSlot.append(slot.querySelector('.learning-hub'));
}
