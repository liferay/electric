---
description: "Configuration options for gulp tasks."
icon: "gear"
layout: "docs"
title: "Configuration"
weight: 5
---

<article id="registering">

## Registering

All tasks are registered in the project's `gulpfile.js`.

```javascript
const gulp = require('gulp');
const electric = require('electric');

electric.registerTasks({
	gulp: gulp
});
```

</article>

<article id="tasks">

## Available Tasks

### Generate

To generate your distribution files, simple run the following command.

```shell
gulp generate
```

This will render all `soy` and `markdown` files from `src` into HTML and place
them in the `dist` folder.

</article>

<article id="options">

## Options

### `registerTasks`

#### gulp

- Required: `true`
- Type: Gulp instance

An instance of [gulp](http://gulpjs.com/).

#### codeMirrorLanguages

- Required: `false`
- Type: `Array<languageName>`
- Default: `['xml', 'css', 'javascript']`

An Array of langauge names for syntax highlighting.
See [CodeMirror](https://codemirror.net/mode/index.html) for a list of available
languages.

#### codeMirrorTheme

- Required: `false`
- Type: `String`
- Default: `'dracula'`

Theme to be used by CodeMirror.
See [CodeMirror](https://codemirror.net/demo/theme.html) for a list of available
themes.

#### markdownOptions

- Required: `false`
- Type: `Object`

An Object Literal containing configuration options
for [Remarkable](https://github.com/jonschlinkert/remarkable) which is
used to render Markdown files.

Example:

```javascript
ssg.registerTasks({
	gulp: gulp,
	markdownOptions: {
		breaks: true
	}
});
```

See [Remarkable's documentation](https://github.com/jonschlinkert/remarkable#options) for
list of options.

#### pathDest

- Required: `false`
- Type: `String`
- Default: `dist`

The path that generated files are placed in.

Example:

```javascript
ssg.registerTasks({
	gulp: gulp,
	pathDest: 'build'
});
```

Now all generated files will be placed in the `build` directory.

#### pathSrc

- Required: `false`
- Type: `String`
- Default: `src`

The path where all source files are located.

Example:

```javascript
ssg.registerTasks({
	gulp: gulp,
	pathSrc: 'web'
});
```

Now `electric` will look inside the `web` directory for all source files.

#### plugins

- Required: `false`
- Type: `Array<String>`

Array of `npm` modules that expose Metal components.

Example:

```javascript
electric.registerTasks({
	gulp: gulp,
	plugins: ['electric-components']
});
```

The components found in the `electric-components` package will now be available
to all `soy` files in your project.

Note that every package listed in `plugins` must also be listed as a dependency
in the project's `package.json`.

#### taskPrefix

- Required: `false`
- Type: `String`

String that is prefixed to every task exposed by `electric`.

Example:

```javascript
ssg.registerTasks({
	gulp: gulp,
	taskPrefix: 'ssg:'
});
```

The `generate` task will now be exposed as `ssg:generate`. This option allows
you to implement `electric` in conjunction with other packages that
expose `gulp` tasks without the risk of overwriting previously defined tasks.

</article>
