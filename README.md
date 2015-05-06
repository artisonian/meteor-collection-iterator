Collection Iterator
===================

This package adds a method to `Mongo.Collection` instances which returns
an [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

## Example

```js
Animals = new Mongo.Collection('animals');

'ant bat cat dog elk fox gnu hog'.split(' ').forEach(function (animal) {
  Animals.insert({
    name: animal
  });
});

var iterator = Animals.iterator();
iterator.next(); // => { value: { name: 'ant' }, done: false }
iterator.next(); // => { value: { name: 'bat' }, done: false }
```

## Rationale

Why use iterators when `map` and `forEach` already exist? [Laziness](http://en.wikipedia.org/wiki/Lazy_evaluation). Reginald Braithwaite has a [noteworthy article](http://raganwald.com/2015/02/17/lazy-iteratables-in-javascript.html) about the virtues of lazy iterables and the patterns they enable:

```js
// Use iterators and transducers to get the last 50 user events
// to occur on Sundays
var transform = transducers.compose(
  transducers.filter(function (doc) {
    return new Date(doc.timestamp).getUTCDay() === 0;
  }),
  transducers.take(50)
);
var iterator = UserEvents.iterator({}, {
  sort: [['timestamp', 'desc']]
});
var results = transducers.into([], transform, iterator);
```

## API

`collection.iterator([selector], [options])`

Creates an iterator object. Takes the same parameters as `collection.find()`, except `reactive` and `transform` options are currently unsupported.
