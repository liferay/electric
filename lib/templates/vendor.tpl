<script>
	<% if (codeMirror) { %>
		CodeMirror.defaults.lineNumbers = true;
		CodeMirror.defaults.matchBrackets = true;
		CodeMirror.defaults.readOnly = true;
		CodeMirror.defaults.tabindex = -1;
		CodeMirror.defaults.tabSize = 2;
		CodeMirror.defaults.theme = '<%= codeMirror.theme %>';
		CodeMirror.defaults.viewportMargin = Infinity;

		var REGEX_LB = /&#123;/g;

		var REGEX_RB = /&#125;/g;

		function runCodeMirror() {lb}
			var code = document.querySelectorAll('.code');

			for (var i = 0; i < code.length; i++) {lb}
				// Workaround for soy issue where namespace and template tags are
				// rendered inside literal blocks
				var text = code[i].innerText
					.replace(REGEX_LB, '{lb}')
					.replace(REGEX_RB, '{rb}');

				var editor = CodeMirror(function(elt) {lb}
					var preEl = code[i].parentNode;

					preEl.parentNode.appendChild(elt);
				{rb}, {lb}
					mode: code[i].getAttribute('data-mode') || '',
					value: text
				{rb});
			{rb}

			if (window.ElectricCodeTabs) {lb}
				new window.ElectricCodeTabs();
			{rb}
		{rb}

		runCodeMirror();
	<% } %>

	function runGoogleAnalytics(path) {lb}
		if (typeof ga === 'function') {lb}
			ga('set', 'page', path);
			ga('send', 'pageview');
		{rb}
	{rb}

	document.addEventListener('DOMContentLoaded', function() {lb}
		if (typeof senna !== 'undefined') {lb}
			var app = senna.dataAttributeHandler.getApp();
			app.on('endNavigate', function(event) {lb}
				runGoogleAnalytics(event.path);
			{rb});
		{rb}
	{rb});

	<% if (googleAnalytics) { %>
		(function(i,s,o,g,r,a,m){lb}i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){lb}
		(i[r].q=i[r].q||[]).push(arguments){rb},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		{rb})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', '<%= googleAnalytics %>', 'auto');
		ga('send', 'pageview');
	<% } %>
</script>
