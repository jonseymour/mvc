function Controller(config)
{
  if (config.init) {
    this.init = config.init;
  }
  this.view = new View(config.view);
  this.model = new Model(config.model);
  this.bindingsConfig = config.bindings;
  this.bind(impl.model, impl.view);
  this.init();
}

Controller.prototype.init= function()
{
  this.update();
};

Controller.prototype.view = {};

Controller.prototype.model = {};

Controller.prototype.bindingsConfig = {};

Controller.prototype.bindings = {};

Controller.prototype.read = function() {
    var b;

    for (b in this.bindings) {
	b.read();
    }
};

Controller.prototype.update = function() {
    var b;

    for (b in this.bindings) {
	b.update();
    }

};

Controller.prototype.bind = function(model, view) {
    this.bindings = {};
    // this function needs to iterate over the accessors provided by the view
    // and select an appropriate binding for each, using the configuration
    // where required for hints.
};


