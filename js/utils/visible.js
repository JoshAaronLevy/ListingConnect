exports.isVisible = isVisible;
exports.onVisible = onVisible;

function isVisible(el) {
	if (!el) { return null; }
	if (el && el.on && !el.nodeType) { el = el[0]; }
	if (el && (el.nodeType !== 1 || el === document.body)) {
		return true;
	}
	if (el.currentStyle && el.currentStyle['display'] !== 'none' && el.currentStyle['visibility'] !== 'hidden') {
		return isVisible(el.parentNode);
	} else if (window.getComputedStyle) {
		var cs = document.defaultView.getComputedStyle(el, null);
		if (cs.getPropertyValue('display') !== 'none' && cs.getPropertyValue('visibility') !== 'hidden') {
			return isVisible(el.parentNode);
		}
	}
	return false;
}

function onVisible(el, callback = null) {
	if (!el) { return null; }
	if (el && el.on && !el.nodeType) { el = el[0]; }
	if ( isVisible(el) ) {
		callback.apply(el);
	} else {
		setTimeout(onVisible.bind(null, el, callback), 333);
	}
	return false;
}
