import { setupDialog } from './dialog.js';

const topics = [
  {
    id: 'python',
    title: 'Advanced Python for Data Science',
    questions: [
      'Explain when you would use a generator instead of a list.',
      'How would you handle missing values before analysing a dataset?',
    ],
  },
  {
    id: 'evaluation',
    title: 'Model Evaluation & Selection',
    questions: [
      'When would precision matter more than recall? Explain with an example.',
      'How can cross-validation help you compare two models?',
    ],
  },
  {
    id: 'genai',
    title: 'Generative AI & LLM Integration',
    questions: [
      'Explain the difference between retrieval-augmented generation and fine-tuning.',
      'How would you evaluate whether an LLM response is grounded in your source data?',
    ],
  },
];

export function setupSampleGallery() {
  let type = 'handbook';
  let index = 0;
  const image = document.querySelector('#sample-image');
  const imageButton = document.querySelector('.sample-image-button');
  const workbook = document.querySelector('#workbook-preview');
  const panel = document.querySelector('#sample-panel');
  const tabs = [...document.querySelectorAll('[data-sample]')];
  const modal = setupDialog(document.querySelector('#sample-dialog'));

  function render() {
    const topic = topics[index];
    const isWorkbook = type === 'workbook';
    imageButton.hidden = isWorkbook;
    workbook.hidden = !isWorkbook;
    if (isWorkbook) {
      workbook.innerHTML = `<p class="workbook-label">LEARNLYTICS · ILLUSTRATIVE PRACTICE PREVIEW</p><h3>Think it through.</h3><p class="workbook-chapter">${topic.title}</p><ol>${topic.questions.map((question) => `<li>${question}</li>`).join('')}</ol><p class="workbook-footer">Your approach matters. Explain your reasoning.</p>`;
    } else {
      image.src = `/assets/images/samples/ds-${topic.id}-${type}-v2.webp`;
      image.alt = `Actual LearnLytics ${topic.title} ${type === 'handbook' ? 'handbook' : 'solution manual'} sample page`;
    }
    document.querySelector('#sample-subject').textContent = topic.title;
    document.querySelector('#sample-position').textContent = `0${index + 1} / 03`;
    document.querySelector('#sample-note').textContent = isWorkbook
      ? 'Illustrative practice preview. The final workbook sample will be added later.'
      : `An actual page from the existing LearnLytics ${type === 'handbook' ? 'handbook' : 'solution manual'}.`;
    document
      .querySelectorAll('[data-sample-index]')
      .forEach((button) =>
        button.setAttribute('aria-current', String(Number(button.dataset.sampleIndex) === index)),
      );
    tabs.forEach((tab) => {
      const selected = tab.dataset.sample === type;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${type}`);
    document.querySelector('#sample-status').textContent =
      `${type}: ${topic.title}, sample ${index + 1} of ${topics.length}.`;
  }

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => {
      type = tab.dataset.sample;
      render();
    });
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (tabIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (tabIndex + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      type = tabs[next].dataset.sample;
      render();
      tabs[next].focus();
    });
  });
  document.querySelector('.sample-previous').addEventListener('click', () => {
    index = (index + topics.length - 1) % topics.length;
    render();
  });
  document.querySelector('.sample-next').addEventListener('click', () => {
    index = (index + 1) % topics.length;
    render();
  });
  document.querySelectorAll('[data-sample-index]').forEach((button) =>
    button.addEventListener('click', () => {
      index = Number(button.dataset.sampleIndex);
      render();
    }),
  );
  imageButton.addEventListener('click', () => {
    const enlarged = document.querySelector('#sample-enlarged');
    enlarged.src = image.src;
    enlarged.alt = image.alt;
    document.querySelector('#sample-dialog-title').textContent =
      `${topics[index].title} — ${type === 'handbook' ? 'Handbook' : 'Solutions'}`;
    modal.open();
  });
}
