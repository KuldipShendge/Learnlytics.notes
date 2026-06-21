// ── SLIDER ──────────────────────────────

const totalCourses = 3; 

let current = 0, locked = false;

const track = document.getElementById('track');

const detailView = document.getElementById('detail-view');

const homeFooter = document.getElementById('homeFooter');

function buildDots() {

  const dotsEl = document.getElementById('dots');

  if (!dotsEl) return;

  dotsEl.innerHTML = '';

  for(let i=0; i<totalCourses; i++) {

    const d = document.createElement('div');

    d.className = 'dot' + (i === 0 ? ' active' : '');

    d.onclick = () => goTo(i);

    dotsEl.appendChild(d);

  }

}

function goTo(n) {

  if (!track || !detailView) return;

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

let wheelThrottled = false;
window.addEventListener('wheel', e => {

  if (wheelThrottled) return;
  if (!track || !detailView) return;

  if (detailView.classList.contains('open') || document.getElementById('coursesMenuSection')?.style.display === 'block') return;

  wheelThrottled = true;
  setTimeout(() => { wheelThrottled = false; }, 100);
  goTo(current + (e.deltaY > 0 ? 1 : -1));

}, { passive: true });

let touchStartY = 0;

window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });

window.addEventListener('touchend', e => {

  if (!track || !detailView) return;

  if (detailView.classList.contains('open') || document.getElementById('coursesMenuSection')?.style.display === 'block') return;

  const dy = touchStartY - e.changedTouches[0].clientY;

  if (Math.abs(dy) > 40) goTo(current + (dy > 0 ? 1 : -1));

}, { passive: true });

buildDots();

// ── FULL WEBSITE MENU & DETAIL VIEWS ──

function openCoursesMenu() {

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

  // Show Courses section

  const cms = document.getElementById('coursesMenuSection');

  if (cms) cms.style.display = 'block';

  // Update sidebar active states

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const courseNavItem = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Course Handbook Bundle'));

  if (courseNavItem) courseNavItem.classList.add('active');

  // Update topbar header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="showDashboard()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Course Bundles</span>

      </div>

    `;

  }

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'instant' });

}

function closeCoursesMenu() {

  showDashboard();

}

// ── HANDBOOK DROPDOWN LOGIC ──

function toggleHandbookDropdown(e) {

  e.stopPropagation();

  var dd = document.getElementById('handbookDropdown');

  if (!dd) return;

  dd.classList.toggle('open');

}

function closeHandbookDropdown() {

  var dd = document.getElementById('handbookDropdown');

  if (dd) dd.classList.remove('open');

}

// Close dropdown when clicking outside

document.addEventListener('click', function(e) {

  var wrap = document.querySelector('.handbook-dropdown-wrap');

  if (wrap && !wrap.contains(e.target)) {

    closeHandbookDropdown();

  }

});

function goToFreeSQL() {

  openDetail('data-analyst');

  // Scroll to the free SQL handbook button after the detail view opens

  setTimeout(function() {

    var btn = document.querySelector('#course-data-analyst .form-submit-full');

    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }, 500);

}

function goToFreeML() {

  openDetail('data-science');

  // Scroll to the free ML handbook button after the detail view opens

  setTimeout(function() {

    var btn = document.querySelector('#course-data-science .form-submit-full');

    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }, 500);

}

function openDetail(courseId) {
  if (courseId === 'data-analyst' || courseId === 'data-analyst-questions') {
    loadLazyIframe('sqlQuestionsIframe');
  } else if (courseId === 'data-science' || courseId === 'data-science-questions') {
    loadLazyIframe('mlQuestionsIframe');
  }

  if (courseId === 'data-analyst' || courseId === 'data-analyst-questions' || courseId === 'data-science' || courseId === 'data-science-questions') {

                if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
      closePythonHandbook();
    }
    if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
      closePythonDsHandbook();
    }
    if (document.getElementById('mathDetailSection')?.style.display === 'block') {
      closeMathHandbook();
    }
    if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
      closeMathDsHandbook();
    }
    if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
      closeSqlHandbook();
    }
    if (document.getElementById('biDetailSection')?.style.display === 'block') {
      closeBiHandbook();
    }
    if (document.getElementById('deDetailSection')?.style.display === 'block') {
      closeDeHandbook();
    }
    if (document.getElementById('domainDetailSection')?.style.display === 'block') {
      closeDomainHandbook();
    }
    if (document.getElementById('aiDetailSection')?.style.display === 'block') {
      closeAiHandbook();
    }
    if (document.getElementById('excelDetailSection')?.style.display === 'block') {
      closeExcelHandbook();
    }
    if (document.getElementById('mathDetailSection')?.style.display === 'block') {
      closeMathHandbook();
    }
    if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
      closeMathDsHandbook();
    }
    if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
      closeSqlHandbook();
    }
    if (document.getElementById('biDetailSection')?.style.display === 'block') {
      closeBiHandbook();
    }
    if (document.getElementById('deDetailSection')?.style.display === 'block') {
      closeDeHandbook();
    }
    if (document.getElementById('domainDetailSection')?.style.display === 'block') {
      closeDomainHandbook();
    }
    if (document.getElementById('aiDetailSection')?.style.display === 'block') {
      closeAiHandbook();
    }
    if (document.getElementById('excelDetailSection')?.style.display === 'block') {
      closeExcelHandbook();
    }
    if (document.getElementById('mathDetailSection')?.style.display === 'block') {
      closeMathHandbook();
    }
    if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
      closeSqlHandbook();
    }
    if (document.getElementById('biDetailSection')?.style.display === 'block') {
      closeBiHandbook();
    }
    if (document.getElementById('deDetailSection')?.style.display === 'block') {
      closeDeHandbook();
    }
    if (document.getElementById('domainDetailSection')?.style.display === 'block') {
      closeDomainHandbook();
    }
    if (document.getElementById('aiDetailSection')?.style.display === 'block') {
      closeAiHandbook();
    }
    if (document.getElementById('excelDetailSection')?.style.display === 'block') {
      closeExcelHandbook();
    }
    // Hide main dashboard homepage elements

    const statsGrid = document.querySelector('.stats-grid');

    const dashGrid = document.querySelector('.dashboard-grid');

    const dashBottom = document.querySelector('.dashboard-bottom');

    if (statsGrid) statsGrid.style.display = 'none';

    if (dashGrid) dashGrid.style.display = 'none';

    if (dashBottom) dashBottom.style.display = 'none';

    // Hide other sections

    hideAllSections();

    // Show the target section

    const target = document.getElementById('course-' + courseId);

    if (target) {

      target.style.display = 'block';

    }

    // Update sidebar active states to 'Course Handbook Bundle'

    document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

    const courseNavItem = Array.from(document.querySelectorAll('.dashboard-nav-item'))

      .find(item => item.textContent.includes('Course Handbook Bundle'));

    if (courseNavItem) courseNavItem.classList.add('active');

    // Update topbar header text to breadcrumbs

    const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

    if (topbarLeft) {

      if (!topbarLeft.dataset.originalHtml) {

        topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

      }

      if (courseId === 'data-analyst' || courseId === 'data-science') {

        const title = courseId === 'data-analyst' ? 'Data &amp; BI Analyst Bundle' : 'Data Scientist &amp; Gen AI Engineer Bundle';

        topbarLeft.innerHTML = `

          <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

            <span onclick="showDashboard()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span onclick="openCoursesMenu()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Course Bundles</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span style="color:var(--navy);font-weight:700;">${title}</span>

          </div>

        `;

      } else {

        const parentId = courseId === 'data-analyst-questions' ? 'data-analyst' : 'data-science';

        const parentTitle = courseId === 'data-analyst-questions' ? 'Data &amp; BI Analyst Bundle' : 'Data Scientist &amp; Gen AI Engineer Bundle';

        topbarLeft.innerHTML = `

          <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

            <span onclick="showDashboard()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span onclick="openDetail('${parentId}')" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">${parentTitle}</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span style="color:var(--navy);font-weight:700;">Interview Questions</span>

          </div>

        `;

      }

    }

    var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'instant' });

    return;

  }

  document.querySelectorAll('.course-container').forEach(el => el.classList.remove('active'));

  var course = document.getElementById('course-' + courseId);

  if (!course || !detailView) return;

  course.classList.add('active');

  detailView.classList.add('open');

  if (homeFooter) homeFooter.style.display = 'none'; 

  document.body.style.overflow = 'hidden'; 

  detailView.scrollTop = 0; 

  // window.location.hash = courseId; // Removed: routing system uses pushState

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

}

function closeDetail() {

  if (!detailView) return;

  detailView.classList.remove('open');

  if (homeFooter) homeFooter.style.display = 'flex';

  document.body.style.overflow = 'auto';

  // NEW: Remove the hash from the URL when going back home

  window.history.replaceState(null, null, window.location.pathname);

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = '';

}

function scrollDashboardTop() {

  showDashboard();

}

// All section IDs that can be toggled

var allSectionIds = ['coursesMenuSection', 'exploreAllHandbooksSection', 'insideHandbookSection', 'toolsTechSection', 'freeHandbooksSection', 'reviewsSection', 'course-data-analyst', 'course-data-analyst-questions', 'course-data-science', 'course-data-science-questions'];

function hideAllSections() {

  allSectionIds.forEach(function(id) {

    var el = document.getElementById(id);

    if (el) el.style.display = 'none';

  });

}

function showDashboard() {

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
    return;
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
    return;
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
    return;
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
    return;
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
    return;
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
    return;
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
    return;
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
    return;
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
    return;
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
    return;
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
    return;
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
    return;
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
    return;
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
    return;
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
    return;
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
    return;
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
    return;
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
    return;
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
    return;
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
    return;
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
    return;
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
    return;
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
    return;
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
    return;
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
    return;
  }
  hideAllSections();

  // Show main dashboard homepage elements

  var statsGrid = document.querySelector('.stats-grid');

  var dashGrid = document.querySelector('.dashboard-grid');

  var dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Update sidebar active state

  document.querySelectorAll('.dashboard-nav-item').forEach(function(item) { item.classList.remove('active'); });

  var dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(function(item) { return item.textContent.includes('Dashboard'); });

  if (dashBtn) dashBtn.classList.add('active');

  // Restore original header content if modified

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  } else {

    // Restore topbar header text just in case

    var h1 = document.querySelector('.dashboard-topbar h1');

    var p = document.querySelector('.dashboard-topbar p');

    if (h1 && p) {

      h1.innerHTML = 'Welcome to Learn<span class="brand-lytics">lytics</span>';

      p.innerHTML = 'Your one-stop hub for high-quality handbooks to <strong>learn, practice &amp; grow.</strong>';

    }

  }

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = '';

  window.scrollTo({ top: 0, behavior: 'instant' });

}

var sectionConfig = {

  inside:  { id: 'insideHandbookSection',  title: "What's Inside Handbook", subtitle: 'Discover the 3 powerful files you get in every handbook.' },

  tools:   { id: 'toolsTechSection',        title: 'Tools & Tech Cover',     subtitle: 'Everything you need to succeed in the Data World.' },

  free:    { id: 'freeHandbooksSection',     title: 'Free Handbooks',         subtitle: 'Download high-quality handbooks completely free.' },

  reviews: { id: 'reviewsSection',          title: 'Student Reviews',        subtitle: 'Hear from learners who upgraded their careers.' }

};

function showSection(section) {

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Restore original header content if it was replaced with breadcrumbs

  var topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  var config = sectionConfig[section];

  if (!config) return;

  var target = document.getElementById(config.id);

  if (!target) return;

  // Hide dashboard grids

  var statsGrid = document.querySelector('.stats-grid');

  var dashGrid = document.querySelector('.dashboard-grid');

  var dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections, then show target

  hideAllSections();

  target.style.display = 'block';

  // Update sidebar active

  document.querySelectorAll('.dashboard-nav-item').forEach(function(item) { item.classList.remove('active'); });

  var activeButton = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(function(item) { var oc = item.getAttribute('onclick'); return oc && oc.includes("'" + section + "'"); });

  if (activeButton) activeButton.classList.add('active');

  // Update topbar

  var h1 = document.querySelector('.dashboard-topbar h1');

  var p = document.querySelector('.dashboard-topbar p');

  if (h1 && p) {

    h1.innerHTML = config.title;

    p.innerHTML = config.subtitle;

  }

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'instant' });

}

// Legacy alias

function showDashboardSection(section) { showSection(section); }

function openPythonHandbook() {
  loadLazyIframe('pythonSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show Python details section

  const pythonSection = document.getElementById('pythonDetailSection');

  if (pythonSection) {

    pythonSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closePythonHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Python for Data Professionals</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closePythonHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide Python details section

  const pythonSection = document.getElementById('pythonDetailSection');

  if (pythonSection) {

    pythonSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openPythonDsHandbook() {
  loadLazyIframe('pythonDsSyllabusIframe');
  // Hide main dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = 'none';
  if (dashGrid) dashGrid.style.display = 'none';
  if (dashBottom) dashBottom.style.display = 'none';
  
  // Hide all sections first
  hideAllSections();
  if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  
  // Show Python DS details section
  const pythonDsSection = document.getElementById('pythonDsDetailSection');
  if (pythonDsSection) {
    pythonDsSection.style.display = 'block';
  }
  
  // Update header text to breadcrumbs
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft) {
    if (!topbarLeft.dataset.originalHtml) {
      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;
    }
    topbarLeft.innerHTML = `
      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">
        <span onclick="closePythonDsHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>
        <span style="color:var(--muted);margin:0 8px;">&gt;</span>
        <span style="color:var(--navy);font-weight:700;">Python For Data Science Handbook</span>
      </div>
    `;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePythonDsHandbook() {
  // Restore dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = '';
  if (dashGrid) dashGrid.style.display = '';
  if (dashBottom) dashBottom.style.display = '';
  
  // Hide Python DS details section
  const pythonDsSection = document.getElementById('pythonDsDetailSection');
  if (pythonDsSection) {
    pythonDsSection.style.display = 'none';
  }
  
  // Restore original header content
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft && topbarLeft.dataset.originalHtml) {
    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;
  }
  
  // Set Dashboard nav active
  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));
  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))
    .find(item => item.textContent.includes('Dashboard'));
  if (dashBtn) dashBtn.classList.add('active');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMathHandbook() {
  loadLazyIframe('mathSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show Math details section

  const mathSection = document.getElementById('mathDetailSection');

  if (mathSection) {

    mathSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeMathHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Mathematics &amp; Statistics Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeMathHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide Math details section

  const mathSection = document.getElementById('mathDetailSection');

  if (mathSection) {

    mathSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openMathDsHandbook() {
  loadLazyIframe('mathDsSyllabusIframe');
  // Hide main dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = 'none';
  if (dashGrid) dashGrid.style.display = 'none';
  if (dashBottom) dashBottom.style.display = 'none';
  
  // Hide all sections first
  hideAllSections();
    if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  
  // Show Math DS details section
  const mathDsSection = document.getElementById('mathDsDetailSection');
  if (mathDsSection) {
    mathDsSection.style.display = 'block';
  }
  
  // Update header text to breadcrumbs
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft) {
    if (!topbarLeft.dataset.originalHtml) {
      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;
    }
    topbarLeft.innerHTML = `
      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">
        <span onclick="closeMathDsHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>
        <span style="color:var(--muted);margin:0 8px;">&gt;</span>
        <span style="color:var(--navy);font-weight:700;">Mathematics &amp; Statistics For Data Science Handbook</span>
      </div>
    `;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeMathDsHandbook() {
  // Restore dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = '';
  if (dashGrid) dashGrid.style.display = '';
  if (dashBottom) dashBottom.style.display = '';
  
  // Hide Math DS details section
  const mathDsSection = document.getElementById('mathDsDetailSection');
  if (mathDsSection) {
    mathDsSection.style.display = 'none';
  }
  
  // Restore original header content
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft && topbarLeft.dataset.originalHtml) {
    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;
  }
  
  // Set Dashboard nav active
  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));
  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))
    .find(item => item.textContent.includes('Dashboard'));
  if (dashBtn) dashBtn.classList.add('active');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSqlHandbook() {
  loadLazyIframe('sqlSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show SQL details section

  const sqlSection = document.getElementById('sqlDetailSection');

  if (sqlSection) {

    sqlSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeSqlHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">SQL &amp; Databases Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeSqlHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide SQL details section

  const sqlSection = document.getElementById('sqlDetailSection');

  if (sqlSection) {

    sqlSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openBiHandbook() {
  loadLazyIframe('biSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show BI details section

  const biSection = document.getElementById('biDetailSection');

  if (biSection) {

    biSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeBiHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Business Intelligence &amp; Dashboards Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeBiHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide BI details section

  const biSection = document.getElementById('biDetailSection');

  if (biSection) {

    biSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openDeHandbook() {
  loadLazyIframe('deSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show DE details section

  const deSection = document.getElementById('deDetailSection');

  if (deSection) {

    deSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeDeHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Data Engineering Fundamentals Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeDeHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide DE details section

  const deSection = document.getElementById('deDetailSection');

  if (deSection) {

    deSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openDomainHandbook() {
  loadLazyIframe('domainSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show Domain details section

  const domainSection = document.getElementById('domainDetailSection');

  if (domainSection) {

    domainSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeDomainHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Storytelling, Communication &amp; Domain Knowledge Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeDomainHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide Domain details section

  const domainSection = document.getElementById('domainDetailSection');

  if (domainSection) {

    domainSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openAiHandbook() {
  loadLazyIframe('aiSyllabusIframe');

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show AI details section

  const aiSection = document.getElementById('aiDetailSection');

  if (aiSection) {

    aiSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeAiHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">AI-Era Analytics Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeAiHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide AI details section

  const aiSection = document.getElementById('aiDetailSection');

  if (aiSection) {

    aiSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openExcelHandbook() {
  loadLazyIframe('excelSyllabusIframe');
  // Hide main dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = 'none';
  if (dashGrid) dashGrid.style.display = 'none';
  if (dashBottom) dashBottom.style.display = 'none';
  
  // Hide all sections first
  hideAllSections();
      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  
  // Show Excel details section
  const excelSection = document.getElementById('excelDetailSection');
  if (excelSection) {
    excelSection.style.display = 'block';
  }
  
  // Update header text to breadcrumbs
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft) {
    if (!topbarLeft.dataset.originalHtml) {
      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;
    }
    topbarLeft.innerHTML = `
      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">
        <span onclick="closeExcelHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>
        <span style="color:var(--muted);margin:0 8px;">&gt;</span>
        <span style="color:var(--navy);font-weight:700;">Excel &amp; Google Sheets Handbook</span>
      </div>
    `;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeExcelHandbook() {
  // Restore dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = '';
  if (dashGrid) dashGrid.style.display = '';
  if (dashBottom) dashBottom.style.display = '';
  
  // Hide Excel details section
  const excelSection = document.getElementById('excelDetailSection');
  if (excelSection) {
    excelSection.style.display = 'none';
  }
  
  // Restore original header content
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft && topbarLeft.dataset.originalHtml) {
    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;
  }
  
  // Set Dashboard nav active
  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));
  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))
    .find(item => item.textContent.includes('Dashboard'));
  if (dashBtn) dashBtn.classList.add('active');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAllPythonModules() {

  const modules = ['py-mod1', 'py-mod2', 'py-mod3', 'py-mod4', 'py-mod5', 'py-mod6'];

  const btn = document.getElementById('toggleAllModulesBtn');

  if (!btn) return;

  const isExpand = btn.textContent.includes('Expand');

  modules.forEach(id => {

    const card = document.getElementById(id);

    if (card) {

      if (isExpand) {

        card.classList.add('open');

      } else {

        card.classList.remove('open');

      }

    }

  });

  btn.textContent = isExpand ? 'Collapse All' : 'Expand All';

}

function togglePhase(id) {

  const card = document.getElementById(id);

  if (!card) return;

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

      downloadText: "📄 Download ML Part-01 Handbook Now",

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

  const titleEl = document.getElementById('modal-title');
  const subEl = document.getElementById('modal-sub');
  const successEl = document.getElementById('modal-success-msg');
  const dlBtn = document.getElementById('modal-download-btn');
  if (!titleEl || !subEl || !dlBtn) return;

  titleEl.innerText = currentModalConfig.title;

  subEl.innerHTML = currentModalConfig.sub;

  if (successEl) successEl.innerText = currentModalConfig.successMsg;

  dlBtn.href = currentModalConfig.fileLink;

  dlBtn.innerText = currentModalConfig.downloadText;

  // Update bonus message based on type (DA = SQL, DS = ML)

  var bonusMsg = document.getElementById('modal-bonus-msg');

  if (bonusMsg) {

    if (type === 'ds-handbook' || type === 'ds-questions') {

      bonusMsg.textContent = 'Want Machine Learning Part 01 Interview Question Set? Message us on WhatsApp to get it instantly.';

    } else {

      bonusMsg.textContent = 'Want our SQL Interview Question Set? Message us on WhatsApp to get it instantly.';

    }

  }

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

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || wa.replace(/\D/g,'').length < 10) { 

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

    } else if (document.getElementById('coursesMenuSection')?.style.display === 'block') {

      closeCoursesMenu();

    } else if (detailView && detailView.classList.contains('open')) {

      closeDetail();

    }

  }

  // FIX: added review-modal and coursesMenuSection to guard — previously arrow keys could navigate slides while modal was open

  const reviewModal = document.getElementById('review-modal');

  const coursesSection = document.getElementById('coursesMenuSection');

  const isCoursesOpen = coursesSection && coursesSection.style.display === 'block';

  if ((detailView && detailView.classList.contains('open')) || document.getElementById('modal')?.classList.contains('open') || isCoursesOpen || (reviewModal && reviewModal.classList.contains('open'))) return;

  if (!track) return;

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

  if (useAsianCheckout) {

    updateWithin(scienceRoots, '.price-basic', el => el.textContent = '\u20B9399');

    updateWithin(scienceRoots, '.price-bundle', el => el.textContent = '\u20B9899');

    updateWithin(scienceRoots, '.strike-bundle', el => el.textContent = '\u20B93,500');

  } else {

    updateWithin(scienceRoots, '.price-basic', el => el.textContent = '$29');

    updateWithin(scienceRoots, '.price-bundle', el => el.textContent = '$39');

    updateWithin(scienceRoots, '.strike-basic', el => el.textContent = '$49');

    updateWithin(scienceRoots, '.strike-bundle', el => el.textContent = '$99');

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

// --- EXPLORE ALL HANDBOOKS LOGIC ---

const popularityOrder = ['hb-math', 'hb-math-ds', 'hb-python', 'hb-python-ds', 'hb-ml', 'hb-dl', 'hb-genai', 'hb-sql', 'hb-mlops', 'hb-bi', 'hb-de', 'hb-ai', 'hb-domain', 'hb-eda', 'hb-model', 'hb-excel'];

const analyticsOrder = ['hb-math', 'hb-excel', 'hb-sql', 'hb-python', 'hb-bi', 'hb-de', 'hb-domain', 'hb-ai'];

const scienceOrder = ['hb-math-ds', 'hb-python-ds', 'hb-eda', 'hb-ml', 'hb-model', 'hb-dl', 'hb-mlops', 'hb-genai'];

function filterHandbooks() {

  const filter = document.getElementById('explore-sort-select').value;

  const container = document.getElementById('explore-grid-container');

  if (!container) return;

  const cards = Array.from(container.getElementsByClassName('explore-card'));

  let orderArray = popularityOrder;

  if (filter === 'analytics') orderArray = analyticsOrder;

  else if (filter === 'science') orderArray = scienceOrder;

  // Hide all first

  cards.forEach(c => c.style.display = 'none');

  // Update count text

  document.getElementById('explore-showing-text').textContent = `1-${orderArray.length} of ${orderArray.length}`;

  // Reorder and show

  orderArray.forEach((id, index) => {

    const card = document.getElementById(id);

    if (card) {

      card.style.display = 'block';

      // Update the number tag

      const numSpan = card.querySelector('.explore-num');

      if (numSpan) numSpan.textContent = (index + 1).toString().padStart(2, '0');

      container.appendChild(card); // Moves to end

    }

  });

}

function openExploreAllHandbooks() {

        if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('pythonDsDetailSection')?.style.display === 'block') {
    closePythonDsHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  hideAllSections();

  const eah = document.getElementById('exploreAllHandbooksSection');

  if (eah) {

    eah.style.display = 'block';

    document.getElementById('explore-sort-select').value = 'popularity';

    filterHandbooks();

  }

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

}



/* ==========================================
   MOBILE SIDEBAR DRAWER TRIGGERS (ADDED)
   ========================================== */

function toggleMobileSidebar(isOpen) {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    if (isOpen) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    } else {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // restore background scrolling
    }
  }
}

// Automatically close the mobile sidebar drawer when a navigation item is clicked
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.dashboard-nav-item, .sidebar-help-btn');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      toggleMobileSidebar(false);
    });
  });
});

/* ==========================================
   GLOBAL SEARCH
   ========================================== */

const SEARCH_INDEX = [
  // ── Course Bundles ──
  {
    name: "Data BI Analyst Bundle",
    keywords: ["data analyst", "da bundle", "analyst bundle", "data analyst bundle", "bundle", "bi analyst", "data bi", "course bundle"],
    category: "Course Bundle",
    categoryClass: "cat-bundle",
    price: "₹699",
    icon: "📦",
    iconClass: "type-bundle",
    type: "bundle",
    action: function() { openDetail('data-analyst'); }
  },
  {
    name: "Data Scientist & GenAI Engineer Bundle",
    keywords: ["data scientist", "ds bundle", "scientist bundle", "data science bundle", "bundle", "genai bundle", "gen ai bundle", "course bundle"],
    category: "Course Bundle",
    categoryClass: "cat-bundle",
    price: "₹699",
    icon: "📦",
    iconClass: "type-bundle",
    type: "bundle",
    action: function() { openDetail('data-science'); }
  },
  // ── Active Handbooks ──
  {
    name: "Mathematics & Statistics For Data Analyst",
    keywords: ["math", "stats", "statistics", "data analyst", "da", "maths", "mathematics", "probability"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openMathHandbook(); }
  },
  {
    name: "Python for Data Analyst",
    keywords: ["python", "py", "data analyst", "da", "analytics", "pandas", "numpy"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openPythonHandbook(); }
  },
  {
    name: "SQL & Databases",
    keywords: ["sql", "database", "db", "queries", "free", "mysql", "postgres", "query"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "Free",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openSqlHandbook(); }
  },
  {
    name: "Excel & Google Sheets",
    keywords: ["excel", "sheets", "google sheets", "spreadsheet", "vlookup", "pivot"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openExcelHandbook(); }
  },
  {
    name: "Business Intelligence & Dashboards",
    keywords: ["bi", "power bi", "tableau", "dashboard", "dashboards", "business intelligence", "visualization"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openBiHandbook(); }
  },
  {
    name: "Data Engineering Fundamentals",
    keywords: ["de", "data engineering", "etl", "pipeline", "spark", "airflow", "engineering"],
    category: "Data Engineering",
    categoryClass: "cat-de",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openDeHandbook(); }
  },
  {
    name: "Storytelling, Communication & Domain Knowledge",
    keywords: ["storytelling", "domain", "communication", "soft skills", "presentation", "business"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openDomainHandbook(); }
  },
  {
    name: "AI-Era Analytics",
    keywords: ["ai", "artificial intelligence", "ai-era", "ai era", "analytics", "chatgpt", "copilot"],
    category: "Data Analytics",
    categoryClass: "cat-da",
    price: "₹199",
    icon: "📘",
    iconClass: "type-handbook",
    type: "handbook",
    action: function() { openAiHandbook(); }
  },
  // ── Coming Soon Handbooks ──
  {
    name: "Mathematics & Statistics For Data Science",
    keywords: ["math", "stats", "statistics", "data science", "ds", "maths", "mathematics", "linear algebra", "calculus"],
    category: "Data Science",
    categoryClass: "cat-ds",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "Python For Data Science",
    keywords: ["python", "py", "data science", "ds", "scikit", "sklearn", "machine learning python"],
    category: "Data Science",
    categoryClass: "cat-ds",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "Classical Machine Learning",
    keywords: ["ml", "machine learning", "classical ml", "regression", "classification", "clustering", "supervised"],
    category: "Machine Learning",
    categoryClass: "cat-mle",
    price: "Part 01 Free",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "Deep Learning Fundamentals",
    keywords: ["dl", "deep learning", "neural network", "cnn", "rnn", "transformer"],
    category: "Deep Learning",
    categoryClass: "cat-mle",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "Generative AI & LLM Integration",
    keywords: ["genai", "gen ai", "llm", "chatgpt", "generative", "gpt", "large language model", "prompt"],
    category: "Generative AI",
    categoryClass: "cat-mle",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "EDA & Feature Engineering",
    keywords: ["eda", "feature engineering", "exploratory", "data analysis", "feature selection"],
    category: "Data Science",
    categoryClass: "cat-ds",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "Model Evaluation, Selection & Tuning",
    keywords: ["model", "evaluation", "tuning", "hyperparameter", "cross validation", "model selection"],
    category: "Data Science",
    categoryClass: "cat-ds",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  },
  {
    name: "MLOps & Model Deployment",
    keywords: ["mlops", "deployment", "ci/cd", "model ops", "docker", "kubernetes", "production"],
    category: "MLOps",
    categoryClass: "cat-mle",
    price: "₹199",
    icon: "🔜",
    iconClass: "type-coming",
    type: "coming",
    action: function() { alert('Coming July 20'); }
  }
];

function filterSearch(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  if (q.length < 1) return [];
  return SEARCH_INDEX.filter(function(item) {
    // Check item name
    if (item.name.toLowerCase().includes(q)) return true;
    // Check keywords
    return item.keywords.some(function(kw) { return kw.includes(q); });
  });
}

function renderSearchResults(results, query) {
  var dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;

  if (!query || query.trim().length < 1) {
    dropdown.classList.remove('active');
    dropdown.innerHTML = '';
    return;
  }

  if (results.length === 0) {
    var noResultDiv = document.createElement('div');
    noResultDiv.className = 'search-no-results';
    var iconSpan = document.createElement('span');
    iconSpan.textContent = '🔍';
    noResultDiv.appendChild(iconSpan);
    noResultDiv.appendChild(document.createTextNode('No results found for "' + query + '"'));
    dropdown.innerHTML = '';
    dropdown.appendChild(noResultDiv);
    dropdown.classList.add('active');
    return;
  }

  // Group results
  var bundles = results.filter(function(r) { return r.type === 'bundle'; });
  var handbooks = results.filter(function(r) { return r.type === 'handbook'; });
  var coming = results.filter(function(r) { return r.type === 'coming'; });

  var html = '';

  if (bundles.length > 0) {
    html += '<div class="search-dropdown-group">📦 Course Bundles</div>';
    bundles.forEach(function(item) {
      html += buildSearchItem(item);
    });
  }

  if (handbooks.length > 0) {
    if (bundles.length > 0) html += '<div class="search-dropdown-divider"></div>';
    html += '<div class="search-dropdown-group">📘 Handbooks</div>';
    handbooks.forEach(function(item) {
      html += buildSearchItem(item);
    });
  }

  if (coming.length > 0) {
    if (bundles.length > 0 || handbooks.length > 0) html += '<div class="search-dropdown-divider"></div>';
    html += '<div class="search-dropdown-group">🔜 Coming Soon</div>';
    coming.forEach(function(item) {
      html += buildSearchItem(item);
    });
  }

  dropdown.innerHTML = html;
  dropdown.classList.add('active');

  // Attach click handlers
  var items = dropdown.querySelectorAll('.search-dropdown-item');
  items.forEach(function(el) {
    el.addEventListener('click', function() {
      var idx = parseInt(el.getAttribute('data-index'));
      var searchInput = document.getElementById('globalSearchInput');
      if (searchInput) { searchInput.value = ''; }
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      if (SEARCH_INDEX[idx]) SEARCH_INDEX[idx].action();
    });
  });
}

function buildSearchItem(item) {
  var idx = SEARCH_INDEX.indexOf(item);
  var priceHtml = '';
  if (item.type === 'coming') {
    priceHtml = '<span class="search-item-coming">Coming July 20</span>';
  } else if (item.price === 'Free' || item.price === 'Part 01 Free') {
    priceHtml = '<span class="search-item-price free">' + item.price + '</span>';
  } else {
    priceHtml = '<span class="search-item-price">' + item.price + '</span>';
  }
  return '<button class="search-dropdown-item" data-index="' + idx + '" type="button">' +
    '<div class="search-item-icon ' + item.iconClass + '">' + item.icon + '</div>' +
    '<div class="search-item-body">' +
      '<div class="search-item-name">' + item.name + '</div>' +
      '<div class="search-item-meta">' +
        '<span class="search-item-badge ' + item.categoryClass + '">' + item.category + '</span>' +
      '</div>' +
    '</div>' +
    priceHtml +
  '</button>';
}

// ── Search Event Listeners ──
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('globalSearchInput');
  var dropdown = document.getElementById('searchDropdown');
  if (!searchInput || !dropdown) return;

  // Live search on typing
  var searchDebounceTimer;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(function() {
      var query = searchInput.value;
      var results = filterSearch(query);
      renderSearchResults(results, query);
    }, 150);
  });

  // Re-open on focus if there is text
  searchInput.addEventListener('focus', function() {
    var query = searchInput.value;
    if (query && query.trim().length > 0) {
      var results = filterSearch(query);
      renderSearchResults(results, query);
    }
  });

  // Close on Escape
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      searchInput.blur();
    }
  });

  // Close on click outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
    }
  });
});


function loadLazyIframe(id) {
  const iframe = document.getElementById(id);
  if (iframe && iframe.dataset.src && !iframe.getAttribute('src')) {
    iframe.src = iframe.dataset.src;
  }
}

/* ==========================================
   CLIENT-SIDE ROUTING & CLEAN URL PATHS
   ========================================== */

let isNavigatingFromRouter = false;

function safePushState(url) {
  if (!isNavigatingFromRouter && window.location.pathname !== url) {
    window.history.pushState(null, '', url);
  }
}

function handleRouting(path) {
  isNavigatingFromRouter = true;
  try {
    const cleanPath = path.replace(/\/index\.html$/, '') || '/';
    const decodedPath = decodeURIComponent(cleanPath);
    const normalizedPath = decodedPath.toLowerCase().trim().replace(/\s+/g, '-');
    
    if (normalizedPath === '/' || normalizedPath === '') {
      showDashboard();
    } else if (normalizedPath === '/course-bundles') {
      openCoursesMenu();
    } else if (normalizedPath === '/course-bundles/data-bi-analyst-bundle') {
      openDetail('data-analyst');
    } else if (
      normalizedPath === '/course-bundles/data-bi-analyst-bundle/data-scientist-genai-engineer-bundle' ||
      normalizedPath === '/course-bundles/data-scientist-genai-engineer-bundle'
    ) {
      openDetail('data-science');
    } else if (normalizedPath === '/course-bundles/data-bi-analyst-bundle/interview-questions') {
      openDetail('data-analyst-questions');
    } else if (
      normalizedPath === '/course-bundles/data-bi-analyst-bundle/data-scientist-genai-engineer-bundle/interview-questions' ||
      normalizedPath === '/course-bundles/data-scientist-genai-engineer-bundle/interview-questions'
    ) {
      openDetail('data-science-questions');
    } else if (normalizedPath === '/whats-inside') {
      showSection('inside');
    } else if (normalizedPath === '/tools-tech') {
      showSection('tools');
    } else if (normalizedPath === '/free-download') {
      showSection('free');
    } else if (normalizedPath === '/review') {
      showSection('reviews');
    } else if (normalizedPath === '/all-handbook-page') {
      openExploreAllHandbooks();
    } else if (normalizedPath === '/all-handbook-page/math-stats') {
      openMathHandbook();
    } else if (normalizedPath === '/all-handbook-page/math-stats-ds') {
      openMathDsHandbook();
    } else if (normalizedPath === '/all-handbook-page/python') {
      openPythonHandbook();
    } else if (normalizedPath === '/all-handbook-page/python-ds') {
      openPythonDsHandbook();
    } else if (normalizedPath === '/all-handbook-page/sql') {
      openSqlHandbook();
    } else if (normalizedPath === '/all-handbook-page/excel') {
      openExcelHandbook();
    } else if (normalizedPath === '/all-handbook-page/bi-tools') {
      openBiHandbook();
    } else if (normalizedPath === '/all-handbook-page/de') {
      openDeHandbook();
    } else if (normalizedPath === '/all-handbook-page/ai-era') {
      openAiHandbook();
    } else if (normalizedPath === '/all-handbook-page/domain') {
      openDomainHandbook();
    }
  } catch (e) {
    console.error('Routing transition error:', e);
  } finally {
    isNavigatingFromRouter = false;
  }
}

// Wrapper interceptions for Page Open triggers
if (typeof showDashboard === 'function') {
  const originalShowDashboard = showDashboard;
  showDashboard = function(...args) {
    originalShowDashboard.apply(this, args);
    safePushState('/');
  };
}

if (typeof openCoursesMenu === 'function') {
  const originalOpenCoursesMenu = openCoursesMenu;
  openCoursesMenu = function(...args) {
    originalOpenCoursesMenu.apply(this, args);
    safePushState('/course-bundles');
  };
}

if (typeof openDetail === 'function') {
  const originalOpenDetail = openDetail;
  openDetail = function(courseId, ...args) {
    originalOpenDetail.apply(this, [courseId, ...args]);
    if (courseId === 'data-analyst') {
      safePushState('/course-bundles/data-bi-analyst-bundle');
    } else if (courseId === 'data-science') {
      safePushState('/course-bundles/data-scientist-genai-engineer-bundle');
    } else if (courseId === 'data-analyst-questions') {
      safePushState('/course-bundles/data-bi-analyst-bundle/interview-questions');
    } else if (courseId === 'data-science-questions') {
      safePushState('/course-bundles/data-scientist-genai-engineer-bundle/interview-questions');
    }
  };
}

if (typeof showSection === 'function') {
  const originalShowSection = showSection;
  showSection = function(section, ...args) {
    originalShowSection.apply(this, [section, ...args]);
    if (section === 'inside') {
      safePushState('/whats-inside');
    } else if (section === 'tools') {
      safePushState('/tools-tech');
    } else if (section === 'free') {
      safePushState('/free-download');
    } else if (section === 'reviews') {
      safePushState('/review');
    }
  };
}

if (typeof openExploreAllHandbooks === 'function') {
  const originalOpenExploreAllHandbooks = openExploreAllHandbooks;
  openExploreAllHandbooks = function(...args) {
    originalOpenExploreAllHandbooks.apply(this, args);
    safePushState('/all-handbook-page');
  };
}

if (typeof openMathHandbook === 'function') {
  const originalOpenMathHandbook = openMathHandbook;
  openMathHandbook = function(...args) {
    originalOpenMathHandbook.apply(this, args);
    safePushState('/all-handbook-page/math-stats');
  };
}

if (typeof openMathDsHandbook === 'function') {
  const originalOpenMathDsHandbook = openMathDsHandbook;
  openMathDsHandbook = function(...args) {
    originalOpenMathDsHandbook.apply(this, args);
    safePushState('/all-handbook-page/math-stats-ds');
  };
}

if (typeof openPythonHandbook === 'function') {
  const originalOpenPythonHandbook = openPythonHandbook;
  openPythonHandbook = function(...args) {
    originalOpenPythonHandbook.apply(this, args);
    safePushState('/all-handbook-page/python');
  };
}

if (typeof openPythonDsHandbook === 'function') {
  const originalOpenPythonDsHandbook = openPythonDsHandbook;
  openPythonDsHandbook = function(...args) {
    originalOpenPythonDsHandbook.apply(this, args);
    safePushState('/all-handbook-page/python-ds');
  };
}

if (typeof openSqlHandbook === 'function') {
  const originalOpenSqlHandbook = openSqlHandbook;
  openSqlHandbook = function(...args) {
    originalOpenSqlHandbook.apply(this, args);
    safePushState('/all-handbook-page/sql');
  };
}

if (typeof openExcelHandbook === 'function') {
  const originalOpenExcelHandbook = openExcelHandbook;
  openExcelHandbook = function(...args) {
    originalOpenExcelHandbook.apply(this, args);
    safePushState('/all-handbook-page/excel');
  };
}

if (typeof openBiHandbook === 'function') {
  const originalOpenBiHandbook = openBiHandbook;
  openBiHandbook = function(...args) {
    originalOpenBiHandbook.apply(this, args);
    safePushState('/all-handbook-page/bi-tools');
  };
}

if (typeof openDeHandbook === 'function') {
  const originalOpenDeHandbook = openDeHandbook;
  openDeHandbook = function(...args) {
    originalOpenDeHandbook.apply(this, args);
    safePushState('/all-handbook-page/de');
  };
}

if (typeof openAiHandbook === 'function') {
  const originalOpenAiHandbook = openAiHandbook;
  openAiHandbook = function(...args) {
    originalOpenAiHandbook.apply(this, args);
    safePushState('/all-handbook-page/ai-era');
  };
}

if (typeof openDomainHandbook === 'function') {
  const originalOpenDomainHandbook = openDomainHandbook;
  openDomainHandbook = function(...args) {
    originalOpenDomainHandbook.apply(this, args);
    safePushState('/all-handbook-page/domain');
  };
}

// Wrapper interceptions for Page Close triggers to restore Home URL
const closeHandlers = [
  'closePythonHandbook', 'closePythonDsHandbook', 'closeMathHandbook',
  'closeMathDsHandbook', 'closeSqlHandbook', 'closeBiHandbook',
  'closeDeHandbook', 'closeDomainHandbook', 'closeAiHandbook', 'closeExcelHandbook'
];
closeHandlers.forEach(handlerName => {
  if (typeof window[handlerName] === 'function') {
    const originalClose = window[handlerName];
    window[handlerName] = function(...args) {
      originalClose.apply(this, args);
      safePushState('/');
    };
  }
});

// Setup popstate and DOMContentLoaded routing listeners
window.addEventListener('popstate', () => {
  handleRouting(window.location.pathname);
});

// Perform routing on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    handleRouting(window.location.pathname);
  });
} else {
  handleRouting(window.location.pathname);
}

// Automatically sync mobile home content visibility with stats-grid visibility
document.addEventListener('DOMContentLoaded', function() {
  var statsGrid = document.querySelector('.stats-grid');
  var mobileHome = document.querySelector('.mobile-home-content');
  if (statsGrid && mobileHome) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'style') {
          if (statsGrid.style.display === 'none') {
            mobileHome.classList.add('hide-mobile-home');
          } else {
            mobileHome.classList.remove('hide-mobile-home');
          }
        }
      });
    });
    observer.observe(statsGrid, { attributes: true, attributeFilter: ['style'] });
    
    // Initial check in case stats-grid is already hidden
    if (statsGrid.style.display === 'none') {
      mobileHome.classList.add('hide-mobile-home');
    }
  }
});

