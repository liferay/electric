<script>
	CodeMirror.defaults.lineNumbers = true;
	CodeMirror.defaults.matchBrackets = true;
	CodeMirror.defaults.readOnly = true;
	CodeMirror.defaults.theme = '<%= theme %>';
	CodeMirror.defaults.viewportMargin = Infinity;

	code = document.querySelectorAll('.code');

	for (var i = 0; i < code.length; i++) {lb}
		var editor = CodeMirror(function(elt) {lb}
			code[i].parentNode.replaceChild(elt, code[i]);
		{rb}, {lb}
			mode: code[i].getAttribute('data-mode') || '',
			value: code[i].innerHTML
		{rb});
	{rb}
</script>
