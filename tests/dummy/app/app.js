import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import { modulePrefix, podModulePrefix } from './config/environment';

const App = Application.extend({
  modulePrefix,
  podModulePrefix,
  Resolver,
});

loadInitializers(App, modulePrefix);

export default App;
