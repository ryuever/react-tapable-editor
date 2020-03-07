const Immutable = require("immutable");

const KEY_SEPARATOR = "-";

function MultiDecorator(decorators) {
  this.decorators = Immutable.List(decorators);
}

/**
    Return list of decoration IDs per character

    @param {ContentBlock}
    @return {List<String>}
*/
MultiDecorator.prototype.getDecorations = function(block, contentState) {
  const decorations = Array(block.getText().length).fill(null);

  this.decorators.forEach(function(decorator, i) {
    const _decorations = decorator.getDecorations(block, contentState);

    _decorations.forEach(function(key, offset) {
      if (!key) {
        return;
      }

      key = i + KEY_SEPARATOR + key;

      decorations[offset] = key;
    });
  });

  return Immutable.List(decorations);
};

/**
    Return component to render a decoration

    @param {String}
    @return {Function}
*/
MultiDecorator.prototype.getComponentForKey = function(key) {
  const decorator = this.getDecoratorForKey(key);
  return decorator.getComponentForKey(this.getInnerKey(key));
};

/**
    Return props to render a decoration

    @param {String}
    @return {Object}
*/
MultiDecorator.prototype.getPropsForKey = function(key) {
  const decorator = this.getDecoratorForKey(key);
  return decorator.getPropsForKey(this.getInnerKey(key));
};

/**
    Return a decorator for a specific key

    @param {String}
    @return {Decorator}
*/
MultiDecorator.prototype.getDecoratorForKey = function(key) {
  const parts = key.split(KEY_SEPARATOR);
  const index = Number(parts[0]);

  return this.decorators.get(index);
};

/**
    Return inner key for a decorator

    @param {String}
    @return {String}
*/
MultiDecorator.prototype.getInnerKey = function(key) {
  const parts = key.split(KEY_SEPARATOR);
  return parts.slice(1).join(KEY_SEPARATOR);
};

export default MultiDecorator;
