import { setupKits } from './kits.js';
import { setupVideos } from './videos.js';
import { setupProduct } from './product.js';
import { setupNavigation } from './navigation.js';
import { setupViews } from './views.js';

setupNavigation();
setupViews({
  home() {
    setupKits();
    setupVideos();
  },
  scientist: setupProduct,
});
