import { module } from 'qunit';
import { resolve } from 'rsvp';

import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

const moduleForAcceptance = (name, options = {}) => {
  module(name, {
    beforeEach(...args) {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach(...args);
      }
    },

    afterEach(...args) {
      const afterEachResult = options.afterEach && options.afterEach(...args);

      return resolve(afterEachResult).then(() => destroyApp(this.application));
    },
  });
};

export default moduleForAcceptance;
