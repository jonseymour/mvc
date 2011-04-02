function Model(members)
{
    var
      api = this,
      impl = {},
      v,
      m;

    for (m in members)
    {
	v = members[m];
	if (typeof members[m] == 'function') {
	    api[m] = (function(v1) {
	      return function() {
		return v1.apply(api, arguments);
	      };
	    })(v);
	} else {
	    impl[m] = v;
	    api[m] = new PropertyAccessor(impl, m);
	}
    }
    return api;
}
