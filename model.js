function Model(members)
{
    var api = this;
    for (var m in members)
    {
	if (typeof members[m] == 'function') {
	    api[m] = function() {
		members[m].apply(api, arguments);
	    };
	} else {
	  api[m] = new PropertyAccessor(members, m);
	}
    }
    return api;
}
