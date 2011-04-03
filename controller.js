function Controller(config)
{
    this.loader = function(f) {
	var
	controller = this;

	return function() {
	    var proceed;

	    try {

		controller.model = new Model(config.model);
		controller.view = new View(config.view);
		controller.bind(config.bindings);

		if (typeof f == 'function') {
		    proceed = f.apply(controller);
		}

		if (proceed) {
		    controller.update();
		}

	    } catch (x) {
		window.alert(x.lineNumber + ': ' + x);
		throw x;
	    }
	    return;
	};
    };
}

Controller.prototype.view = {};

Controller.prototype.model = {};

Controller.prototype.bindings = {};

Controller.prototype.read = function() {
    var b;

    for (b in this.bindings) {
	this.bindings[b].read.apply(this.bindings[b], arguments);
    }
};

Controller.prototype.update = function() {
    var b;

    for (b in this.bindings) {
	this.bindings[b].update.apply(this.bindings[b], arguments);
    }

    return;
};

Controller.prototype.bind = function(config) {
  var
    model=this.model,
    view=this.view,
    controller=this,
    m, // model accessor
    n, // view name
    v, // view accessor
    b, // binding
    configure, // configuration function for binding
    bb,
    t;

    this.bindings = {};

    for (n in view) {
	v = view[n];
	if (!config[n]) {
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


    for (n in config) {
	b = config[n];
	if (b instanceof Array) {
	    bb = [];
	    for (b in config[n]) {
		bb.push(configure(n, (config[n])[b]));
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
	try {
	    return f.apply(this);
	} catch (x) {
	    window.alert(x.lineNumber + ': ' + x);
	    throw x;
	} finally {
	    self.update();
	}
    };
};
