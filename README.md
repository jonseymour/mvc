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

Each view element receives a default binding to the a matching model element, if any. If there is no matching model element, or the default binding is not appropriate one or alternate bindings may be specified via the map of
bindings.

Accessors are functions that address a single model or view element. When invoked with no arguments, an accessor
returns the value of the accessed element. When invoked with one argument, an accessor is used to modify the
accessed element.

Model adapters are functions which adapt values produced by the bound model element into the type expected by the bound view element. View adapters are functions which adapt values produced by the bound view element into the type expected by the bound model element.

DISCLAIMER
==========

AUTHOR
======
(C) Copyright Jon Seymour 2011
	
