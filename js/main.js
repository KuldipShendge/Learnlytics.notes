import { setupKitJourney } from './kit-journey.js?v=journey-20261019';
import { setupReviewsPage, setupReviewReturn } from './reviews.js?v=reviews-page-20261019';
import { setupLearningExperience } from './learning-experience.js?v=themed-images-20261019';
import { setupKits } from './kits.js?v=complete-kit-20261019';
import { setupInlineVideos } from './inline-videos.js?v=guide-covers-logo-20261016';
import { setupProduct } from './product.js?v=mobile-reviews-20261019';
import { curriculum as daCurriculum, productOverview as daOverview } from './da-curriculum.js';
import { curriculum as mlCurriculum, productOverview as mlOverview } from './ml-curriculum.js';
import { curriculum as completeCurriculum, productOverview as completeOverview } from './complete-curriculum.js';
import { setupNavigation } from './navigation.js?v=single-url-1';
import { setupViews } from './views.js?v=inline-guides-20261015';
import { setupCareerResources } from './career-resources.js?v=compact-resources-20261017';

setupNavigation();
setupReviewReturn();
setupViews({
  home() {
    setupKitJourney();
    setupLearningExperience('home');
    setupKits();
    setupInlineVideos();
  },
  scientist: setupProduct,
  analyst: () => setupProduct({curriculum: daCurriculum, productOverview: daOverview, kit: 'analyst'}),
  engineer: () => setupProduct({curriculum: mlCurriculum, productOverview: mlOverview, kit: 'engineer'}),
  complete: () => setupProduct({curriculum: completeCurriculum, productOverview: completeOverview, kit: 'complete'}),
  resources: setupCareerResources,
  reviews: setupReviewsPage,
});
