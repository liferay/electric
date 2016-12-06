# Metal SSG (Static Site Generator)

###### Static site generator using soy templates and [metal.js](http://metaljs.com/).

## Dependencies

Install [Node](https://nodejs.org/en/) if you haven't yet, then run this command
to install the global `npm` dependencies.

```
npm i -g gulp
```

## Install

If you are creating a project from scratch, run this command to install the
dependencies.

```
npm i --save metal-ssg metal-ssg-component
```

### Generator

If you'd rather start with the project boilerplate, you can use the
[yeoman generator](https://www.npmjs.com/package/generator-metal-ssg) to jump
start a project using metal-ssg.

## Use

The project `gulpfile.js` should register the `metal-ssg` tasks.

```js
const gulp = require('gulp');
const ssg = require('metal-ssg');

ssg.registerTasks({
	gulp: gulp,
	plugins: ['metal-ssg-components']
});
```

This snippet will register `gulp` tasks that can be run from the command line.
Run `gulp generate` to run the generator.

## Project Structure

```
|--gulpfile.js (registers tasks)
|--src/
   |--layouts/
      |--base.soy (required base template)
   |--pages/
      |--index.soy (must have an index page)
      |--docs/
         |--index.soy
         |--create.soy (every page rendered to html)
```

### `base.soy`

Every project requires a `base.soy` file to render the the HTML boilerplate. It
must use the `base` namespace with a `.render` template.

The `<!-- inject:metal:js -->`/`<!-- endinject -->` tags will be replaced with
the necesarry code for invoking all metal components.

```soy
{namespace base}

/**
 * @param content
 * @param page
 * @param serialized
 * @param site
 */
{template .render private="true"}
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta content="minimum-scale=1.0, width=device-width" name="viewport">
		<meta name="format-detection" content="telephone=no">
		<meta name="description" content="{$page.description ?: ''}">

		<title>{$page.title} - {$site.title}</title>
	</head>
	<body>
		<!-- inject:metal:js -->
			<div>
				{$content}
			</div>
		<!-- endinject -->
	</body>
</html>
{/template}
```

### `src/pages/index.soy`

All files within the `pages` folder require a `title` and `description` field in
the front matter. The `title` is implemented by the navigation component for
rendering navigation elements.

Soy files within the `pages` folder also require a `.render` template and a
unique namespace.

```soy
---
title: "Home"
description: "Home description."
---

{namespace pageIndex}

/**
 *
 */
{template .render}
	<div>Hello, World!</div>
{/template}

```

## Templates

Templates other than the `base.soy` file can be placed in the `src/templates`
folder. These templates can be manually implemented in any file with
`src/pages`.

### Example

Here is an example of a template that is implemented by the index page of the
site.

`src/layouts/main.soy`

```soy
{namespace main}

/**
 * @param content
 * @param? elementClasses
 * @param site
 */
{template .render}
	<div class="{$elementClasses ?: 'main'}">
		<main class="content">
			<div class="topbar">
				{call SSGNavigation.render}
					{param section: $site.index /}
				{/call}
			</div>

			{$content}
		</main>
	</div>
{/template}
```

In this template the index page meta data is passed to the `SSGNavigation`
component to render list elements that contain anchors to it's child pages.

Here is that template implemented by the index page.

`src/pages/index.soy`

```soy
---
title: "Home"
description: "Home description."
---

{namespace pageIndex}

/**
 *
 */
{template .render}
	{call main.render}
		{param content kind="html"}
			<div>Hello, World!</div>
		{/param}
		{param elementClasses: 'home' /}
	{/call}
{/template}
```

## Front Matter

The front matter of every file in `src/pages` is aggregated and placed in the
`dist/site.json` file.

This data is also passed to every page.

```soy
---
title: "Home"
description: "Home description."
someRandomProperty: "Some random value."
weight: 1
---

{namespace pageIndex}

/**
 * @param page
 * @param site
 */
{template .render}
	{call main.render}
		{param content kind="html"}
			<div>
				{$site.index} // title, description, and children of index page
				{$site.index.children} // array of children

				{$page.title} // == "Home"
				{$page.description} // == "Home description."
				{$page.someRandomProperty} // == "Some random value."
			</div>
		{/param}
		{param elementClasses: 'home' /}
	{/call}
{/template}
```
The `children` property of every page is an array that is sorted by the `weight`
property and then by `title`.

## Metal SSG Components

[metal-ssg-components](https://github.com/Robert-Frampton/metal-ssg-components)
provide metal components that are compatible with data provided by the
`site.json` file.

```soy
---
title: "Home"
description: "Home description."
---

{namespace pageIndex}

/**
 * @param site
 */
{template .render}
	{call main.render}
		{param content kind="html"}
			<div>
				// Renders direct descendants of index page.
				// Grandchildren will be rendered if depth == 2
				{call SSGNavigation.render}
					{param depth: 1 /}
					{param section: $site.index /}
				{/call}

				// Renders input with autocomplete menu that searches all
				// descendants of index.
				{call SSGSearchAutocomplete.render}
					{param section: $site.index /}
					{param placeholder: 'Search Children of Index' /}
				{/call}
			</div>
		{/param}
		{param elementClasses: 'home' /}
	{/call}
{/template}
```

## Markdown

Markdown files can also be placed in `src/pages`. During the generate task these
files are wrapped in a soy template declared in the front matter.

```markdown
---
description: "Markdown description."
layout: "main"
title: "Markdown"
---

## Lorem ipsum dolor sit amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nulla libero, eleifend in euismod eget, fringilla id diam. Proin quis interdum ipsum. Fusce eros metus, hendrerit ut egestas nec, sagittis id velit.

- Lorem
- Curabitur
- Fusce

```

