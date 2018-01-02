import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';

import Application from '../../app';
import config from '../../config/environment';

const startApp = attrs => {
  const attributes = assign({}, config.APP, attrs);

  return run(() => {
    const application = Application.create(attributes);

    application.setupForTesting();
    application.injectTestHelpers();

    return application;
  });
};

export default startApp;
