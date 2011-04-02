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
	    for (var f in form) {
		if (form.hasOwnProperty(f)) {
		    api[f] = new InputAccessor(form[f]);
		}
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

