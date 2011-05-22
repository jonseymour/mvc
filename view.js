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
	    form = document.forms[m];
	    if (!form) {
		continue;
	    }
	    for (f in form.elements) {
		api[form.elements[f].name] = new InputAccessor(form.elements[f]);
	    }
	}
	elt=document.getElementById(m);
	if (elt) {
	    api[m] = new ElementAccessor(elt);
	} else {
	    throw new Error('cannot find view element named: ' + m);
	}
    }
    return api;
}

