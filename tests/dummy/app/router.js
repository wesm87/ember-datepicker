import EmberRouter from '@ember/routing/router';

import { rootURL, locationType } from './config/environment';

const Router = EmberRouter.extend({
  location: locationType,
  rootURL,
});

export default Router;
