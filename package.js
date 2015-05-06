Package.describe({
  name: 'artisonian:collection-iterator',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Adds a method to Mongo collections which returns an iterator',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/artisonian/meteor-collection-iterator',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('mongo-livedata', 'server');
  api.addFiles('collection-iterator.js', 'server');
});

Package.onTest(function(api) {
  Npm.depends({ 'transducers.js': '0.3.2' });

  api.use('tinytest', 'server');
  api.use('artisonian:collection-iterator', 'server');
  api.addFiles('collection-iterator-tests.js', 'server');
});
