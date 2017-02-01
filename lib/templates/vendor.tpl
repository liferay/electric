<script>
	CodeMirror.defaults.lineNumbers = true;
	CodeMirror.defaults.matchBrackets = true;
	CodeMirror.defaults.readOnly = true;
	CodeMirror.defaults.theme = '<%= codeMirror.theme %>';
	CodeMirror.defaults.viewportMargin = Infinity;

	code = document.querySelectorAll('.code');

	var REGEX_LB = /&#123;/g;

	var REGEX_RB = /&#125;/g;

	for (var i = 0; i < code.length; i++) {lb}
		// Workaround for soy issue where namespace and template tags are
		// rendered inside literal blocks
		var text = code[i].innerText
			.replace(REGEX_LB, '{lb}')
			.replace(REGEX_RB, '{rb}');

		var editor = CodeMirror(function(elt) {lb}
			var preEl = code[i].parentNode;

			preEl.parentNode.append(elt);
			preEl.style.display = 'none';
		{rb}, {lb}
			mode: code[i].getAttribute('data-mode') || '',
			value: text
		{rb});
	{rb}
</script>
