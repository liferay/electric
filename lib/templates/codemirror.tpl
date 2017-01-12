<script>
	CodeMirror.defaults.lineNumbers = true;
	CodeMirror.defaults.matchBrackets = true;
	CodeMirror.defaults.readOnly = true;
	CodeMirror.defaults.theme = '<%= theme %>';
	CodeMirror.defaults.viewportMargin = Infinity;

	var code = document.querySelectorAll('.code');
	for (var i = 0; i < code.length; i++) {lb}
		var editor = CodeMirror.fromTextArea(code[i], {lb}
			mode: code[i].getAttribute('data-mode') ? 'text/' + code[i].getAttribute('data-mode') : ''
		{rb});
	{rb}
</script>
