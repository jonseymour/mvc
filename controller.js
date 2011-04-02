function Controller(config)
{
  if (config.init) {
    this.init = config.init;
  }
  this.view = new View(config.view);
  this.model = new Model(config.model);
  this.bindingConfigs = config.bindings;
  this.bind(this.model, this.view);
  this.init();
}

Controller.prototype.init= function()
{
  this.update();
};

Controller.prototype.view = {};

Controller.prototype.model = {};

Controller.prototype.bindingConfigs = {};

Controller.prototype.bindings = {};

Controller.prototype.read = function() {
    var b;

    for (b in this.bindings) {
	this.bindings[b].read();
    }
};

Controller.prototype.update = function() {
    var b;

    for (b in this.bindings) {
	this.bindings[b].update();
    }

};

Controller.prototype.bind = function(model, view) {
  var
    controller=this,
    m, // model accessor
    n, // view name
    v, // view accessor
    b, // binding
    configure, // configuration function for binding
    bb,
    t;

    this.model = model ? model : this.model;
    this.view = view ? view : this.view;
    this.bindings = {};

    for (n in view) {
	v = view[n];
	if (!this.bindingConfigs[n]) {
	    b = v.defaultBinding();
	    this.bindings[n] = b;
	    m = model[n];
	    if (!m) {
		continue;
	    }
	    b.bind(m,v,controller);
	}
    }

    configure = function(name, binding) {
	var m,v;

	if (typeof binding.model != 'function') {
	    if (binding.model instanceof Array) {
		m = new MultiAccessor(model, binding.model);
	    } else {
		m = model[binding.model];
	    }
	} else {
	    m = model[name];
	}
	m = m || new Accessor();
	v = view[name];
	binding.bind(m,v, controller);
	return binding;
    };


    for (n in this.bindingConfigs) {
	b = this.bindingConfigs[n];
	if (b instanceof Array) {
	    bb = [];
	    for (b in this.bindingConfigs[n]) {
		bb.push(configure(n, (this.bindingConfigs[n])[b]));
	    }
	    b = Binding.MULTI(bb);
	} else {
	    configure(n, b);
	}
	this.bindings[n] = b;
    }

    return;
};

Controller.prototype.intercept = function(f)
{
  var self=this;
  return function() {
    var depth=0;
    try {
      depth++;
      return f.apply(this);
    } finally {
      depth--;
      if (depth == 0) {
	self.update();
      }
    }
  };
};