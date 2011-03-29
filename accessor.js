Accessor.NOOP = function() {};

function Accessor(target, props)
{
  target = (target && props) ? target : this;

  var result = function() {
    if (arguments.length > 0) {
      result = target.set.apply(target, arguments);
    } else {
      result = target.get();
    }
  };

  if (props) {
    for (p in props) {
      result[p] = props[p];
    }
  }

  return result;
}

Accessor.prototype.get = Accessor.NOOP;
Accessor.prototype.set = Accessor.NOOP;

function InputAccessor(input)
{
  return Accessor(this, { 'input': input } );
}

InputAccessor.prototype.get=function() {
  return this.input.value;
};

InputAccessor.prototype.set= function(arg) {
  this.input.value = arg;
  return undefined;
};

function ElementAccessor(element)
{
  return Accessor(this, { 'element': element });
}

ElementAccessor.prototype.get = function() {
  return this.element.innerHTML;
};

ElementAccessor.prototype.set = function(arg) {
  this.element.innerHTML = arg ;
  return undefined;
};

function PropertyAccessor(obj, property)
{
  return Accessor(this, obj && property ? { 'object': object, 'property' : property }  : undefined);
}

PropertyAccessor.prototype.get = function() {
  return this.object[this.property];
};

PropertyAccessor.prototype.set = function(value) {
  this.object[this.property] = value;
  return undefined;
};

