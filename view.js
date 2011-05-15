//
// Constructs a view.
//
function View(defs)
{
    var
	api = this,
	elt,
	def,
	form,
	f,
	m;

    for (m in defs) {
	def = defs[m];
	if (def.type == 'form') {
	    form = document.forms[def.id];
	    if (!form) {
		continue;
	    }
	    for (f in form.elements) {
		api[form.elements[f].name] = new InputAccessor(form.elements[f]);
	    }
	} else if (def.type == 'element') {
	  elt = document.getElementById(def.id);
	  api[m] = new ElementAccessor(elt);
	} else {
	  elt = document.getElementById(m);
	  api[m] = new ElementAccessor(elt);
	}
    }
    return api;
}

