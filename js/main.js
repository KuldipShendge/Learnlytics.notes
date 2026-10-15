import { setupKits } from './kits.js?v=single-url-1';
import { setupInlineVideos } from './inline-videos.js?v=compact-guides-20261015';
import { setupProduct } from './product.js?v=guides-20261015';
import { setupNavigation } from './navigation.js?v=single-url-1';
import { setupViews } from './views.js?v=inline-guides-20261015';

setupNavigation();
setupViews({
  home() {
    setupKits();
    setupInlineVideos();
  },
  scientist: setupProduct,
});
