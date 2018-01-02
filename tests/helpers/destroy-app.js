import { run } from '@ember/runloop';

const destroyApp = application => {
  run(application, 'destroy');
};

export default destroyApp;
