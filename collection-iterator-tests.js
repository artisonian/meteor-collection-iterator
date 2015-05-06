Tinytest.add('Iterator method', function (test) {
  var coll = new Mongo.Collection(Random.id());
  test.equal(typeof coll.iterator, 'function');
});

Tinytest.add('Iterator object', function (test) {
  var animals = new Mongo.Collection(Random.id());
  'ant bat'.split(' ').forEach(function (animal) {
    animals.insert({ name: animal });
  });

  var iterator = animals.iterator();
  test.equal(typeof iterator.next, 'function');

  var result = iterator.next();
  test.equal(result.done, false);
  test.equal(result.value.name, 'ant');

  result = iterator.next();
  test.equal(result.done, false);
  test.equal(result.value.name, 'bat');

  result = iterator.next();
  test.equal(result.done, true);
});

Tinytest.add('Iterator with selector', function (test) {
  var animals = new Mongo.Collection(Random.id());
  animals.insert({ name: 'bird', habitat: ['air', 'land'] });
  animals.insert({ name: 'goat', habitat: ['land'] });
  animals.insert({ name: 'frog', habitat: ['land', 'water'] });
  animals.insert({ name: 'fish', habitat: ['water'] });

  var iterator = animals.iterator({ habitat: 'air' });
  var result = iterator.next();
  test.equal(result.done, false);
  test.equal(result.value.name, 'bird');

  result = iterator.next();
  test.equal(result.done, true);
});

Tinytest.add('Iterator with options', function (test) {
  var animals = new Mongo.Collection(Random.id());
  animals.insert({ name: 'bird', habitat: ['air', 'land'] });
  animals.insert({ name: 'goat', habitat: ['land'] });
  animals.insert({ name: 'frog', habitat: ['land', 'water'] });
  animals.insert({ name: 'fish', habitat: ['water'] });

  var iterator = animals.iterator({ habitat: 'land' }, {
    limit: 1,
    sort: [['name', 'desc']],
    fields: { name: 1 }
  });
  var result = iterator.next();
  test.equal(result.done, false);
  test.equal(result.value.name, 'goat');
  test.equal(result.value.habitat, undefined);

  result = iterator.next();
  test.equal(result.done, true);
});

Tinytest.add('Transducers.js interop', function (test) {
  var transducers = Npm.require('transducers.js');
  var events = new Mongo.Collection(Random.id());

  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (n) {
    events.insert({
      name: 'Event-' + n,
      timestamp: Date.UTC(2015, 0, n, 12, 30, 0)
    });
  });

  var transform = transducers.compose(
    transducers.filter(function (doc) {
      return new Date(doc.timestamp).getUTCDate() % 2 !== 0;
    }),
    transducers.map(function (doc) {
      return doc.name.toUpperCase();
    }),
    transducers.take(3)
  );
  var iterator = events.iterator({}, {
    sort: [['timestamp', 'desc']]
  });

  var results = transducers.into([], transform, iterator);
  test.equal(results, ['EVENT-9', 'EVENT-7', 'EVENT-5']);
});
