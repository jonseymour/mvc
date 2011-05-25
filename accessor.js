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
  result.hooks = target.hooks;

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

InputAccessor.HOOKS = {};
InputAccessor.HOOKS.hook=function(name, binding, impl)
{
    binding.view.input[name] = binding.controller.intercept(
	function () {
	    return impl.apply(binding);
	}
    );
};

InputAccessor.HOOKS.ACTION={
  onclick: InputAccessor.HOOKS.hook
};
InputAccessor.HOOKS.DATA={
  onblur: InputAccessor.HOOKS.hook,
  onfocus: InputAccessor.HOOKS.hook
};

InputAccessor.HOOKS.FAST_DATA={
  onchange: InputAccessor.HOOKS.hook,
};

InputAccessor.HOOKS.button=InputAccessor.HOOKS.ACTION;
InputAccessor.HOOKS.submit=InputAccessor.HOOKS.ACTION;
InputAccessor.HOOKS.checkbox=InputAccessor.HOOKS.FAST_DATA;

InputAccessor.prototype.hooks = function()
{
    var hooks = InputAccessor.HOOKS[this.input.type];
    if (hooks) {
	return hooks;
    } else {
	return InputAccessor.HOOKS.DATA;
    }
};

InputAccessor.DEFAULT_BINDING = {};
InputAccessor.DEFAULT_BINDING.button=Binding.ACTION;
InputAccessor.DEFAULT_BINDING.submit=Binding.ACTION;
InputAccessor.DEFAULT_BINDING.checkbox=Binding.INPUT_CHECKED;

InputAccessor.prototype.defaultBinding = function() {
    var constructor = InputAccessor.DEFAULT_BINDING[this.input.type];
    if (constructor) {
	return constructor();
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
    map[i] = this.model[k]();
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
