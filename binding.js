//
// (C) Copyright Jon Seymour 2011
//

//
// A Binding is an object that exports a read and update function.
//
// The read function is used to read the view into the model.
// The update function is used to update the view with the model.
//
// The model and view are both represented by accessor functions.
//
// If the types of the view and model are different, an adapter
// is applied. The modelAdapter adapts values of the model's type
// to the view's type. The viewAdapter adapts values of the view's type
// to the model's type.
//
// VALUE
//   Creates a binding between the value of an view input element and
//   the model.
// INT_VALUE
//   a bidirectional binding between the value of the view and the model,
//   such model stores and integer and the view stores a string.
// INPUT_TYPE
//   a read-only mapping between the type field of an input element and
//   the model
// INPUT_CHECKED
//   a mapping between the type field of an input element and the checked
//   element
// READONLY
//


//
//  Optimise the read function is adapted read if the adapter is the IDENTITY_MAP, and the read function is ADAPTED_READ.
//
Binding.OPTIMIZE_READ = function(read, adapter)
{
  if (adapter == Binding.IDENTITY_MAP && read == Binding.ADAPTED_READ) {
    return Binding.DIRECT_READ;
  } else {
    return read;
  }
};

//
// Optimise the update function, if the update function is ADAPTED_UPDATE and the adapter is IDENTITY_MAP
//
Binding.OPTIMIZE_UPDATE = function(update, adapter)
{
  if (adapter == Binding.IDENTITY_MAP && this.update == Binding.ADAPTED_UPDATE) {
    return Binding.DIRECT_UPDATE;
  } else {
    return update;
  }
};

//
// If the input is a function, the output is that function.
// Otherwise, the output is a function which uses the input object as a map.
//
Binding.AS_MAP = function(obj)
{
  if (typeof obj == 'function') {
    return obj;
  } else {
    return function(arg) {
      return obj[arg];
    };
  }
};

//
// A function that returns the argument as the result.
//
Binding.IDENTITY_MAP = function(arg) {
  return arg;
};

//
// A function that does nothing and has an undefined result.
//
Binding.NOOP = function() { };

//
// A read function that directly updates the model with the view.
//
Binding.DIRECT_READ = function() {
  this.model(this.view());
};

//
// A read function that updates the model after applying the
// view adapter to the view.
//
Binding.ADAPTED_READ = function() {
  this.model(this.viewAdapter(this.view()));
};

//
// An update function that directly updates the view with the model.
//
Binding.DIRECT_UPDATE = function() {
  this.view(this.model());
};

//
// An update function that updates the view with the result of applying
// the model adapter to the model.
//
Binding.ADAPTED_UPDATE = function() {
  this.view(this.modelAdapter(this.model()));
};

//
// An adapter that converts the input to the result
// of applying toString on the input or '' otherwise.
//
Binding.TO_STRING = function(arg) {
  return typeof arg == 'undefined' ? '' : arg.toString();
};

//
// Creates a simple binding between the value of the view and the model.
//
Binding.VALUE=function(config) {
  return new Binding(config,
  {
    bind: function(model, view, controller) {
      var binding=this;
      Binding.prototype.bind.apply(this, arguments);
      if (view.input) {
	view.input.onblur = controller.intercept(
	  function() {
	    binding.read();
	  }
	);
      }
    }
  });
};

Binding.ACTION=function(config) {
  return new Binding(config,
  {
    read: Binding.NOOP,
    update: Binding.NOOP,
    onclick: function() {
	this.model();
    },
    bind: function(model, view, controller) {
	var binding = this;
	Binding.prototype.bind.apply(this, arguments);
	view.input.onclick = controller.intercept(
	    function() {
		binding.onclick();
	    });
	return;
    }
  });
};

//
// Creates a binding that updates the view, but not the model.
//
Binding.READONLY=function(config) {
  return new Binding(config, { read: Binding.NOOP } );
};

//
// Creats a binding that stores an integer in the model and a string in the view
//
Binding.INT_VALUE=function(config) {
  return new Binding(config, {
    viewAdapter: parseInt,
    modelAdapter: Binding.TO_STRING,
    bind: function(model, view, controller) {
      var binding=this;
      Binding.prototype.bind.apply(this, arguments);
      if (view.input) {
	view.input.onblur = controller.intercept(
	  function() {
	    binding.read();
	  }
	);
      }
    }
  });
};

//
// Creates a binding that binds the model to the type selector of a form input.
//
Binding.INPUT_TYPE=function(config) {
  return new Binding(config, {
    read: Binding.NOOP,
    update: function() {
      this.view.input.type = this.modelAdapter(this.model());
    }
  });
};

//
// Creates a binding that binds the model to the checked property of a checkbox input.
//
Binding.INPUT_CHECKED=function(config) {
  return new Binding(config, {
    read: function() {
      this.model(this.viewAdapter(this.view.input.checked));
    },
    update: function() {
      this.view.input.checked = this.modelAdapter(this.model());
    },
    bind: function(model, view, controller) {
      var binding=this;
      Binding.prototype.bind.apply(this, arguments);
      if (view.input) {
	view.input.onchange = controller.intercept(
	  function() {
	    binding.read();
	    return true;
	  }
	);
      }
    }
  });
};

//
// Creates a read-only binding that binds the model to the
// innerHTML property of a view element.
//
Binding.INNER_HTML=function(config)
{
  return new Binding(config, {
    read: Binding.NOOP,
    update: function() {
      this.view.element.innerHTML = this.modelAdapter(this.model());
    }
  });
};

Binding.MULTI=function(bindings)
{
    return new Binding
    (
	{
	    read: function() {
		var b;
		for (b in bindings) {
		    bindings[b].read();
		}
	    },
	    update: function() {
		var b;
		for (b in bindings) {
		    bindings[b].update();
		}
	    }
	}
    );
};

Binding.QUERY=function() {
    return new Binding
    (
	{
	    read: function() {
		var
		query=location.search,
		pairs=query.substring(1).split('&'),
		result = {},
		name,
		value,
		i,
		pair;

		if (pairs != '') {

		    for (i in pairs) {
		      pair=pairs[i];
		      i=pair.indexOf('=');

		      if (i>=0) {
			name = pair.substring(0, i);
			value = decodeURIComponent(pair.substring(i+1));
		      } else {
			name = decodeURIComponent(pair);
			value = '';
		      }
		      result[name] = value;
		    }
		}
		this.model(result);
		return;
	    },
	    update: function() {
		var
		  map = this.modelAdapter(this.model()),
		  search='?',
		  name;
		  for (name in map) {
		    if (search != '?') {
		      search = search + "&";
		    }
		    search += encodeURIComponent(name) + '=' + encodeURIComponent(map[name] || '');
		  }

		  if (location.search != search) {
		    location.search = search;
		  }
	    }
	}
    );
};

//
// Creates a new binding with a read and update function.
//
// If the config doesn't specify any defaults, the specified
// defaults are used instead.
//
function Binding(config, defaults)
{
  // replace array with multi binding.
  var m;

  if (!config) {
    config = {};
  }

  if (defaults) {
    for (m in defaults) {
      if (!config[m]) {
	config[m] = defaults[m];
      }
    }
  }

  if (config instanceof Binding) {
    return config;
  }

  for (m in config) {
    if (config.hasOwnProperty(m)) {
      this[m] = config[m];
    }
  }

  //
  // turn non-functions into map functions, using Binding.AS_MAP
  //

  this.viewAdapter = Binding.AS_MAP(this.viewAdapter);
  this.modelAdapter = Binding.AS_MAP(this.modelAdapter);

  // optimise the bindings if adaption is not required.

  this.read = Binding.OPTIMIZE_READ(this.read, this.viewAdapter);
  this.update = Binding.OPTIMIZE_UPDATE(this.update, this.modelAdapter);

  return this;
}

Binding.prototype.model = Binding.NOOP;
Binding.prototype.view = Binding.NOOP;
Binding.prototype.controller = {};
Binding.prototype.modelAdapter = Binding.IDENTITY_MAP;
Binding.prototype.viewAdapter = Binding.IDENTITY_MAP;
Binding.prototype.read = Binding.ADAPTED_READ;
Binding.prototype.update = Binding.ADAPTED_UPDATE;

//
// Configure the model and view accessor functions for a binding.
//
Binding.prototype.bind=function(model, view, controller)
{
    this.model = model;
    this.view = view;
    this.controller = controller;
};
