//
// Constructs a view.
//
function View(defs)
{
    var
	api = this,
	def,
	form,
	m;

    for (m in defs) {
	def = defs[m];
	if (def.form) {
	    form = document.forms[def.form];
	    if (!form) {
		continue;
	    }
	    for (var f in form) {
		api[f] = new InputAccessor(form[f]);
	    }
	} else if (def.element) {
	  var elt = document.getElementById(def.element);
	  api[m] = new ElementAccessor(elt);
	} else {
	  var elt = document.getElementById(m);
	  api[m] = new ElementAccessor(elt);
	}
    }
    return api;
}

