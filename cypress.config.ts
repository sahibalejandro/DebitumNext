import { defineConfig } from 'cypress';

import tasks from './cypress/support/tasks';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, _config) {
      on('task', {
        'db:seed': tasks.db.seed,
        'db:clean': tasks.db.clean,
        'session:create': tasks.session.create,
      });
    },
  },

  /*
   * iPhone 15 Pro Resolution.
   */
  viewportWidth: 393,
  viewportHeight: 852,
});
