NAME
====
mvc - a simple MVC library implemented in JavaScript.

DESCRIPTION
===========

Controllers
===========
Controllers are described by an instance of mvc.Controller.

A controller is configured with a map of model elements, a map of view elements and a map of bindings.

The controller is initialized by binding the result of a call to its loader function to the
window.onload event, as per the example below.

<pre>
 window.onload=
    new mvc.Controller(
	{
	    model: {
		// ...
	    },
	    view: {
		// ...
	    },
	    bindings: {
		// ...
	    }
	}).loader();
</pre>
Models
======
A model is a map of model elements. Each model element is represented by a function.

A model is configured by a map. Any value in the configuration map which is a function
is wrapped by a closure that ensures that the function is invoked with 'this' referring
to the model. Any non-value in the configuration map which is not a function is used
initialize a private member variable and a public accessor function that can be used to get and set
that variable.

View
====
A view is a map of view elements, where a view element corresponds to a node in the DOM model
or a form input field. 

Each view element is represented by an accessor that can be used to read or update state 
associated with the view element.

Each view element has a default binding that can be used to update the value of the view element.

Binding
=======
A binding is an object that knows how to read from the view into the model and, conversely, to
update the model from the view. Bindings typically transfer the value of the model element to the
value of the view element and vice versa but bindings can also be used to bind the value of a model
element to some other attribute of a view element, such as its disabled or checked flag or its type
attribute.

Each view element receives a default binding to a model element that has a matching name, if any. If there is 
no matching model element, or the default binding is not appropriate one or more alternate bindings 
maybe specified via the map of bindings.

Bindings are constructed by passing a configuration map to a binding constructor. Bindings 
can be configured by providing alternative implementations of the following functions and properties in the 
configuration map:
<dl>
  <dt>read(force)</dt>
  <dd>
    <p>The default implementation calls the view accessor with no arguments, applies the viewAdapter 
      to the result and then calls the model accessor with the result of the viewAdapter call as the only argument.</p>
    <p>If the auto property of the binding is false, the read method does nothing unless the force argument is true.</p>
  </dd>

  <dt>update(force)</dt>
  <dd>
    <p>The default implementation calls the model accessor, applies the modelAdapter to the result and then
    calls the view accessor with the result of the modelAdapter call as the only argument.</p>
    <p>If the auto property of the binding is false, the update method does nothing unless the force argument is true.</p>
  </dd>

  <dt>viewAdapter(view_value)</dt>
  <dd>
    <p>A view adapter is a function, used by a binding's read function, to adapt values produced by 
    the bound view accessor into the type expected by the bound model accessor.</p>
  </dd>     	   

  <dt>modelAdapter(model_value)</dt>
  <dd>
    <p>A model adapter is a function, used by a binding's update function, to adapt values 
    produced by the bound model accessor into the type expected by the bound view accessor.</p>
  </dd>

  <dt>bind(model_accessor, view_accessor, controller)</dt>
  <dd>
    <p>
      The default implementation initializes the model, view and controller properties of the binding. If the 
      view accessor exposes event hooks, a closure is bound to the event which causes the controller to 
      invoke a method on the binding. 
    </p>
  </dd>

  <dt>auto</dt>
  <dd>	
    <p>Configures the default behaviour of read and update if a force argument is fals-ish.</p>
    <p>The default value is true, which means that data values are transferred irrespective of the setting
      of the force flag. If the value is false, value safe only transfered if the read and update methods
      are passed a tru-ish argument.</p>
  </dd>

  <dt>model</dt>
  <dd>
    <p>Specifies the name of the model elements to which the binding applies.</p>
    <p>If this value is not specified, the binding is bound to a model element with the same name as the 
      view element.</p>
    <p>If the value is an array, then a model accessor is created which calls the model accessors of the named
      elements and creates a map whose keys are the specified names and whose values are the result of
    calling the accessors of the specified model elements.</p>
    <p>If the value is an array, then a model accessor is created which calls the model accessors of the named
      elements and creates a map whose keys are the values of the specified map and whose values are the result
      of calling the accessors of the model elements specified by the keys. [ NOT CURRENTLY IMPLEMENTED ].
  </dd>

</dl>

Accessors
=========
Accessors are functions that address a single model or view element. When invoked with no arguments, 
an accessor returns the value of the accessed element. When invoked with one argument, 
an accessor is used to set the value of the accessed element to the specified argument.


AUTHOR
======
(C) Copyright Jon Seymour 2011
	
