// ── SLIDER ──────────────────────────────
const totalCourses = 3; 
let current = 0, locked = false;
const track = document.getElementById('track');
const detailView = document.getElementById('detail-view');
const homeFooter = document.getElementById('homeFooter');

function buildDots() {
  const dotsEl = document.getElementById('dots');
  dotsEl.innerHTML = '';
  for(let i=0; i<totalCourses; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
  }
}

function goTo(n) {
  if (locked) return;
  if (detailView.classList.contains('open')) return;
  locked = true;
  current = Math.max(0, Math.min(totalCourses - 1, n));
  track.style.transform = `translateY(-${current * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  const scrollHint = document.getElementById('scrollHint');
  if(scrollHint) scrollHint.style.opacity = current === totalCourses - 1 ? '0' : '1';
  setTimeout(() => locked = false, 800);
}

window.addEventListener('wheel', e => {
  if (detailView.classList.contains('open') || document.getElementById('courses-menu').classList.contains('open')) return;
  goTo(current + (e.deltaY > 0 ? 1 : -1));
}, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });
window.addEventListener('touchend', e => {
  if (detailView.classList.contains('open') || document.getElementById('courses-menu').classList.contains('open')) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 40) goTo(current + (dy > 0 ? 1 : -1));
}, { passive: true });

buildDots();

// ── FULL WEBSITE MENU & DETAIL VIEWS ──
function openCoursesMenu() {
  document.getElementById('courses-menu').classList.add('open');
  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';
}

function closeCoursesMenu() {
  document.getElementById('courses-menu').classList.remove('open');
  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = '';
}

function openDetail(courseId) {
  document.querySelectorAll('.course-container').forEach(el => el.classList.remove('active'));
  document.getElementById('course-' + courseId).classList.add('active');
  detailView.classList.add('open');
  homeFooter.style.display = 'none'; 
  document.body.style.overflow = 'hidden'; 
  detailView.scrollTop = 0; 
  window.location.hash = courseId;
  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';
}

function closeDetail() {
  detailView.classList.remove('open');
  homeFooter.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // FIX: was 'auto', which broke the full-page slider after closing detail view
  // NEW: Remove the hash from the URL when going back home
  window.history.replaceState(null, null, window.location.pathname);
  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = '';
}

function togglePhase(id) {
  const card = document.getElementById(id);
  card.classList.toggle('open');
}

// Scroll to a phase card and open it (triggered from subject-map chips)
function scrollToPhase(id) {
  const card = document.getElementById(id);
  if (!card) return;
  if (!card.classList.contains('open')) {
    card.classList.add('open');
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── FREE HANDBOOK MODAL LOGIC ──
let currentModalConfig = {
  title: "Get Free SQL Handbook",
  sub: "Enter your details below &mdash; we will send the handbook directly to your inbox. No spam, we promise.",
  successMsg: "We just sent the free handbook directly to your inbox (check your spam folder just in case!).",
  downloadText: "📄 Download Free SQL Handbook Now",
  fileLink: "https://drive.google.com/file/d/1tg1D9w3WbXnH8scho_HbKwbqV6SG8tq0/view?usp=sharing",
  subject: "📄 Your Free SQL Database Handbook — Learnlytics.handbook",
  emailTitle: "Free SQL Database Handbook"
};

function openModal(type) {
  const baseLink = window.location.origin;
  
  if (type === 'sql-questions') {
    currentModalConfig = {
      title: "Get Free SQL Questions Set",
      sub: "Enter your details below &mdash; we will send the sample questions directly to your inbox. No spam, we promise.",
      successMsg: "We just sent the free sample questions directly to your inbox (check your spam folder just in case!).",
      downloadText: "📄 Download Free SQL Questions Now",
      fileLink: "https://drive.google.com/file/d/1tg1D9w3WbXnH8scho_HbKwbqV6SG8tq0/view?usp=sharing",
      subject: "📄 Your Free SQL Questions Set — Learnlytics.handbook",
      emailTitle: "Free SQL Questions Set"
    };
  } else if (type === 'ds-handbook') {
    currentModalConfig = {
      title: "Get Free Machine Learning Handbook",
      sub: "Enter your details below &mdash; we will send the handbook preview directly to your inbox.",
      successMsg: "We just sent the free handbook preview directly to your inbox (check your spam folder just in case!).",
      downloadText: "📄 Download ML Handbook Sample Now",
      fileLink: baseLink + "/pdfs/ML-part01-handbook.pdf",
      subject: "📄 Your Free Machine Learning Handbook Sample — Learnlytics.handbook",
      emailTitle: "Free Machine Learning Handbook Sample"
    };
  } else if (type === 'ds-questions') {
    currentModalConfig = {
      title: "Get Free Machine Learning Questions Set",
      sub: "Enter your details below &mdash; we will send the sample questions directly to your inbox.",
      successMsg: "We just sent the free sample questions directly to your inbox (check your spam folder just in case!).",
      downloadText: "📄 Download ML Questions Sample Now",
      fileLink: baseLink + "/pdfs/ML-part01-que-handook.pdf",
      subject: "📄 Your Free Machine Learning Questions Sample — Learnlytics.handbook",
      emailTitle: "Free Machine Learning Questions Sample"
    };
  } else {
    // Default: sql-handbook
    currentModalConfig = {
      title: "Get Free SQL Handbook",
      sub: "Enter your details below &mdash; we will send the handbook directly to your inbox. No spam, we promise.",
      successMsg: "We just sent the free handbook directly to your inbox (check your spam folder just in case!).",
      downloadText: "📄 Download Free SQL Handbook Now",
      fileLink: "https://drive.google.com/file/d/1tg1D9w3WbXnH8scho_HbKwbqV6SG8tq0/view?usp=sharing",
      subject: "📄 Your Free SQL Database Handbook — Learnlytics.handbook",
      emailTitle: "Free SQL Database Handbook"
    };
  }

  // Swap modal DOM values
  document.getElementById('modal-title').innerText = currentModalConfig.title;
  document.getElementById('modal-sub').innerHTML = currentModalConfig.sub;
  document.getElementById('modal-success-msg').innerText = currentModalConfig.successMsg;
  
  const dlBtn = document.getElementById('modal-download-btn');
  dlBtn.href = currentModalConfig.fileLink;
  dlBtn.innerText = currentModalConfig.downloadText;

  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  setTimeout(() => {
    document.getElementById('modal-form-content').style.display = 'block';
    document.getElementById('modal-success').style.display = 'none';
    document.getElementById('inp-name').value = '';
    document.getElementById('inp-email').value = '';
    document.getElementById('inp-wa').value = '';
  }, 300);
}

function submitModalForm() {
  const name = document.getElementById('inp-name').value.trim();
  const email = document.getElementById('inp-email').value.trim();
  const wa = document.getElementById('inp-wa').value.trim();
  
  if (!name || !email.includes('@') || wa.replace(/\D/g,'').length < 10) { 
      alert('Please fill out all fields correctly.'); return; 
  }

  const btn = document.querySelector('.modal-submit');
  btn.innerText = "Processing...";

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxl9TB50_VHlU_H6r6yCs33NNuzWU0VBqhWG5yXBbe7jwR4jMyd9zWbSj8AMGPRKgMy/exec';

  const formData = new URLSearchParams();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', wa);
  formData.append('fileLink', currentModalConfig.fileLink);
  formData.append('subject', currentModalConfig.subject);
  formData.append('emailTitle', currentModalConfig.emailTitle);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error('Server error');
    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
    btn.innerText = "Unlock My PDF"; 
  })
  .catch(error => {
    alert('Error submitting form. Please try again.');
    btn.innerText = "Unlock My PDF";
  });
}

// ── REVIEW MODAL LOGIC ──
function openReviewModal() {
  document.getElementById('review-modal').classList.add('open');
}

function closeReviewModal() {
  document.getElementById('review-modal').classList.remove('open');
  setTimeout(() => {
    document.getElementById('review-form-content').style.display = 'block';
    document.getElementById('review-success').style.display = 'none';
    document.getElementById('rev-name').value = '';
    document.getElementById('rev-rating').value = '5';
    document.getElementById('rev-text').value = '';
  }, 300);
}

function submitReviewForm() {
  const name = document.getElementById('rev-name').value.trim();
  const rating = document.getElementById('rev-rating').value.trim();
  const review = document.getElementById('rev-text').value.trim();
  
  if (!name || !review) { 
      alert('Please fill out your name and your review.'); return; 
  }

  const btn = document.querySelector('#review-form-content .modal-submit');
  btn.innerText = "Submitting...";

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxl9TB50_VHlU_H6r6yCs33NNuzWU0VBqhWG5yXBbe7jwR4jMyd9zWbSj8AMGPRKgMy/exec';

  const formData = new URLSearchParams();
  formData.append('type', 'review'); 
  formData.append('name', name);
  formData.append('rating', rating);
  formData.append('review', review);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error('Server error');
    document.getElementById('review-form-content').style.display = 'none';
    document.getElementById('review-success').style.display = 'block';
    btn.innerText = "Submit Review"; 
  })
  .catch(error => {
    alert('Error submitting review. Please try again.');
    btn.innerText = "Submit Review";
  });
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('modal').classList.contains('open')) {
      closeModal();
    } else if (document.getElementById('review-modal') && document.getElementById('review-modal').classList.contains('open')) {
      closeReviewModal();
    } else if (document.getElementById('courses-menu').classList.contains('open')) {
      closeCoursesMenu();
    } else if (detailView.classList.contains('open')) {
      closeDetail();
    }
  }
  // FIX: added review-modal to guard — previously arrow keys could navigate slides while review modal was open
  const reviewModal = document.getElementById('review-modal');
  if (detailView.classList.contains('open') || document.getElementById('modal').classList.contains('open') || document.getElementById('courses-menu').classList.contains('open') || (reviewModal && reviewModal.classList.contains('open'))) return;
  if (e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowUp') goTo(current - 1);
});

const REGIONAL_CHECKOUT = {
  dataAnalyst: {
    asia: {
      handbook: 'https://rzp.io/rzp/7gKjrQ1R',
      interview: 'https://rzp.io/rzp/BnUho1gl',
      bundle: 'https://rzp.io/rzp/S2y4eZ3'
    },
    international: {
      handbook: 'https://rzp.io/rzp/D7r6WGq',
      interview: 'https://rzp.io/rzp/kGokl24y',
      bundle: 'https://rzp.io/rzp/ro1v8df'
    }
  },
  dataScience: {
    asia: 'https://rzp.io/rzp/43PikTXQ',
    international: 'https://rzp.io/rzp/jJvaGhJy'
  }
};

const EUROPE_COUNTRY_CODES = new Set([
  'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK',
  'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV',
  'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL',
  'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR',
  'UA', 'GB', 'VA'
]);

const ASIA_COUNTRY_CODES = new Set([
  'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'HK',
  'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA',
  'LB', 'MO', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS',
  'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TL',
  'TM', 'AE', 'UZ', 'VN', 'YE'
]);

function getCourseRoots(courseIds) {
  return courseIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
}

function updateWithin(roots, selector, update) {
  roots.forEach(root => root.querySelectorAll(selector).forEach(update));
}

function replacePaymentLink(oldUrl, newUrl) {
  document.querySelectorAll(`a[href="${oldUrl}"]`).forEach(link => {
    link.href = newUrl;
  });
}

function applyDataAnalystMarket(useInternationalCheckout) {
  if (!useInternationalCheckout) return;

  const analystRoots = getCourseRoots([
    'course-data-analyst',
    'course-data-analyst-questions'
  ]);

  updateWithin(analystRoots, '.price-basic', el => el.textContent = '$19');
  updateWithin(analystRoots, '.price-bundle', el => el.textContent = '$29');
  updateWithin(analystRoots, '.strike-basic', el => el.textContent = '$39');
  updateWithin(analystRoots, '.strike-bundle', el => el.textContent = '$79');
  updateWithin(analystRoots, '.conversion-callout span', el => {
    el.textContent = 'Market Value: $79. Launch Price: $29.';
  });

  const heroOffer = document.querySelector('.conversion-copy span');
  if (heroOffer) {
    heroOffer.textContent = 'Market Value: $79. Launch Price: $29.';
  }

  replacePaymentLink(
    REGIONAL_CHECKOUT.dataAnalyst.asia.handbook,
    REGIONAL_CHECKOUT.dataAnalyst.international.handbook
  );
  replacePaymentLink(
    REGIONAL_CHECKOUT.dataAnalyst.asia.interview,
    REGIONAL_CHECKOUT.dataAnalyst.international.interview
  );
  replacePaymentLink(
    REGIONAL_CHECKOUT.dataAnalyst.asia.bundle,
    REGIONAL_CHECKOUT.dataAnalyst.international.bundle
  );
}

function applyDataScienceMarket(useAsianCheckout) {
  const scienceRoots = getCourseRoots([
    'course-data-science',
    'course-data-science-questions'
  ]);
  const price = useAsianCheckout ? '\u20B91' : '$1';

  updateWithin(scienceRoots, '.price-basic, .price-bundle', el => {
    el.textContent = price;
  });

  if (!useAsianCheckout) {
    updateWithin(scienceRoots, '.strike-basic', el => el.textContent = '$19');
    updateWithin(scienceRoots, '.strike-bundle', el => el.textContent = '$29');
    replacePaymentLink(
      REGIONAL_CHECKOUT.dataScience.asia,
      REGIONAL_CHECKOUT.dataScience.international
    );
  }
}

async function detectCountryCode() {
  const providers = [
    {
      url: 'https://ipapi.co/json/',
      readCountry: data => data.country_code
    },
    {
      url: 'https://api.country.is/',
      readCountry: data => data.country
    }
  ];

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url);
      if (!response.ok) continue;
      const data = await response.json();
      const countryCode = String(provider.readCountry(data) || '').toUpperCase();
      if (/^[A-Z]{2}$/.test(countryCode)) return countryCode;
    } catch (error) {
      // Try the next provider.
    }
  }

  return '';
}

function getLocalCountryOverride() {
  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
  if (!localHosts.has(window.location.hostname)) return '';

  const countryCode = new URLSearchParams(window.location.search)
    .get('test-country')
    ?.toUpperCase();

  return /^[A-Z]{2}$/.test(countryCode || '') ? countryCode : '';
}

async function localizePrices() {
  const countryCode = getLocalCountryOverride() || await detectCountryCode();

  // A failed lookup keeps the safer INR defaults and existing Asian links.
  if (!countryCode) return;

  const useInternationalAnalystCheckout =
    countryCode === 'US' || EUROPE_COUNTRY_CODES.has(countryCode);
  const useAsianScienceCheckout = ASIA_COUNTRY_CODES.has(countryCode);

  applyDataAnalystMarket(useInternationalAnalystCheckout);
  applyDataScienceMarket(useAsianScienceCheckout);
}

// Combined initialization: deep-link routing + price localization
window.addEventListener('DOMContentLoaded', () => {
  // Make direct shared links work
  if (window.location.hash) {
    const hashId = window.location.hash.substring(1);
    if (document.getElementById('course-' + hashId)) {
      openDetail(hashId);
    }
  }
  // Detect location and swap currency
  localizePrices();
});
