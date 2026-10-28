import { setupKitJourney } from './kit-journey.js?v=journey-20261019';
import { setupReviewsPage, setupReviewReturn } from './reviews.js?v=page-routes-20261020';
import { setupLearningExperience } from './learning-experience.js?v=toolkit-editions-20261024';
import { setupKits } from './kits.js?v=page-routes-20261020';
import { setupInlineVideos } from './inline-videos.js?v=guide-covers-logo-20261016';
import { setupProduct } from './product.js?v=course-samples-20261028';
import { curriculum as daCurriculum, productOverview as daOverview } from './da-curriculum.js?v=course-samples-20261028';
import { curriculum as mlCurriculum, productOverview as mlOverview } from './ml-curriculum.js?v=course-samples-20261028';
import { curriculum as completeCurriculum, productOverview as completeOverview } from './complete-curriculum.js?v=course-samples-20261028';
import { setupNavigation } from './navigation.js?v=single-url-1';
import { setupViews } from './views.js?v=page-routes-20261020';
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
