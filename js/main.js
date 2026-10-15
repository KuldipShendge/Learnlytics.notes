import { setupKits } from './kits.js?v=single-url-1';
import { setupVideos } from './videos.js?v=guides-20261015';
import { setupProduct } from './product.js?v=guides-20261015';
import { setupNavigation } from './navigation.js?v=single-url-1';
import { setupViews } from './views.js?v=single-url-1';

setupNavigation();
setupViews({
  home() {
    setupKits();
    setupVideos();
  },
  scientist: setupProduct,
});
