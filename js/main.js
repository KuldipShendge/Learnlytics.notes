import { setupKits } from './kits.js?v=single-kit-card-20261016';
import { setupInlineVideos } from './inline-videos.js?v=guide-covers-logo-20261016';
import { setupProduct } from './product.js?v=benefit-card-20261016';
import { curriculum as daCurriculum, productOverview as daOverview } from './da-curriculum.js';
import { setupNavigation } from './navigation.js?v=single-url-1';
import { setupViews } from './views.js?v=inline-guides-20261015';
import { setupCareerResources } from './career-resources.js?v=resource-delivery-20261017';

setupNavigation();
setupViews({
  home() {
    setupKits();
    setupInlineVideos();
  },
  scientist: setupProduct,
  analyst: () => setupProduct({curriculum: daCurriculum, productOverview: daOverview, kit: 'analyst'}),
  resources: setupCareerResources,
});
