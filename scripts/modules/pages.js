/* Registry of the SPA route modules. */
import page_home from '../pages/home.js';
import page_pet_training from '../pages/pet_training.js';
import page_board_train from '../pages/board_train.js';
import page_private_lessons from '../pages/private_lessons.js';
import page_puppy_foundations from '../pages/puppy_foundations.js';
import page_day_training from '../pages/day_training.js';
import page_working_dogs from '../pages/working_dogs.js';
import page_detection_agency from '../pages/detection_agency.js';
import page_about from '../pages/about.js';
import page_reviews from '../pages/reviews.js';
import page_service_area from '../pages/service_area.js';
import page_faq from '../pages/faq.js';
import page_contact from '../pages/contact.js';
import page_thank_you from '../pages/thank_you.js';
import page_privacy from '../pages/privacy.js';
import page_accessibility from '../pages/accessibility.js';
import page_terms from '../pages/terms.js';
import page_not_found from '../pages/not_found.js';
export const PAGES = {
  '/': page_home,
  '/pet-training': page_pet_training,
  '/board-train': page_board_train,
  '/private-lessons': page_private_lessons,
  '/puppy-foundations': page_puppy_foundations,
  '/day-training': page_day_training,
  '/working-dogs': page_working_dogs,
  '/detection-agency': page_detection_agency,
  '/about': page_about,
  '/reviews': page_reviews,
  '/service-area': page_service_area,
  '/faq': page_faq,
  '/contact': page_contact,
  '/thank-you': page_thank_you,
  '/privacy': page_privacy,
  '/accessibility': page_accessibility,
  '/terms': page_terms,
  '/404': page_not_found,
};
