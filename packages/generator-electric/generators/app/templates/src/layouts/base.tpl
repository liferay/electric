<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta content="minimum-scale=1.0, width=device-width" name="viewport">
		<meta name="description" content="<%= page.description ? page.description : '' %>">

		<title><%= page.title %> - <%= site.title %></title>

		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Roboto+Mono">

		<!-- inject:css -->
		<!-- endinject -->

		<!-- inject:js -->
		<!-- endinject -->

		<link rel="stylesheet" href="<%= site.basePath ? site.basePath : '' %>/styles/main.css">
	</head>
	<body data-senna>
		<div data-senna-surface id="wrapper">
			<div class="senna-loading-bar"></div>

			<!-- inject:metal:js -->
				<div>
					<%= content %>
				</div>
			<!-- endinject -->
		</div>

		<!-- inject:vendor:js -->
		<!-- endinject -->
	</body>
</html>
{/template}