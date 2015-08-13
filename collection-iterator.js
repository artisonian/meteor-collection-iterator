Mongo.Collection.prototype.iterator = function collectionIterator (selector, options) {
  var self = this;

  selector = selector || {};
  options = options || {};

  var coll = self.rawCollection();
  var rawCursor = coll.find(selector, options.fields || {});

  if (options.skip) rawCursor.skip(options.skip);
  if (options.limit) rawCursor.limit(options.limit);
  if (options.sort) rawCursor.sort(options.sort);
  if (options.batchSize) rawCursor.batchSize(options.batchSize);

  return {
    next: function iterate () {
      var doc = Meteor.wrapAsync(rawCursor.nextObject.bind(rawCursor))();

      if (!doc) rawCursor.close();

      return { done: !doc, value: doc };
    }
  };
};
