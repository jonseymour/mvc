Accessor.NOOP = function() {};

function Accessor(target, props)
{
  target = (target && props) ? target : this;

  var result = function() {
    if (arguments.length > 0) {
      return target.set.apply(result, arguments);
    } else {
      return target.get.apply(result);
    }
  };

  if (props) {
    for (p in props) {
      result[p] = props[p];
    }
  }
  result.defaultBinding = target.defaultBinding;

  return result;
}

Accessor.prototype.get = Accessor.NOOP;
Accessor.prototype.set = Accessor.NOOP;
Accessor.prototype.defaultBinding = function() {
  throw new Error("no binding defined for accessor");
};

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

InputAccessor.prototype.defaultBinding = function() {
  if (this.input.type == 'button' || this.input.type == 'submit') {
    return Binding.ACTION();
  } else if (this.input.type == 'checkbox') {
    return Binding.INPUT_CHECKED();
  } else {
    return Binding.INPUT_VALUE();
  }
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

ElementAccessor.prototype.defaultBinding = function() {
    return Binding.INNER_HTML();
};

function PropertyAccessor(obj, property)
{
  return Accessor(this, (obj && property) ? { 'object': obj, 'property' : property }  : undefined);
}

PropertyAccessor.prototype.get = function() {
  return this.object[this.property];
};

PropertyAccessor.prototype.set = function(value) {
  this.object[this.property] = value;
  return undefined;
};

function MultiAccessor(model, keys)
{
    return new Accessor
    (
	this,
	(model && keys) ? { 'model': model, 'keys': keys } : undefined
    );
}

MultiAccessor.prototype.get = function()
{
  var
    i,
    k,
    map = {};

  for (i in this.keys) {
    k=this.keys[i];
    map[k] = this.model[k]();
  }
  return map;
};

MultiAccessor.prototype.set = function(map)
{
  var i,k;
  for (i in this.keys) {
    k=this.keys[i];
    this.model[k](map[k]);
  }
  return;
};
