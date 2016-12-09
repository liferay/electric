---
description: "Gulp tasks for site generating, and configuration options."
icon: "gear"
layout: "docs"
title: "Tasks"
weight: 2
---

<article id="registering">

## Registering

All tasks are registered in the project's `gulpfile.js`.

```js
const gulp = require('gulp');
const ssg = require('metal-ssg');

ssg.registerTasks({
	gulp: gulp
});
```

</article>

<article id="tasks">

## Available Tasks

### Generate

To generate your distribution files, simple run the following command.

```bash
gulp generate
```

This will render all `soy` and `markdown` files from `src` into HTML and place
them in the `dist` folder.

</article>

<article id="configuration">

## Configuration

### `registerTasks`

#### gulp

- Required: `true`
- Type: Gulp instance

An instance of [gulp](http://gulpjs.com/).

#### markdownOptions

- Required: `false`
- Type: `Object`

An Object Literal containing configuration options
for [Remarkable](https://github.com/jonschlinkert/remarkable) which is
used to render Markdown files.

Exmaple:

```js
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

Exmaple:

```js
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

Exmaple:

```js
ssg.registerTasks({
	gulp: gulp,
	pathSrc: 'web'
});
```

Now `metal-ssg` will look inside the `web` directory for all source files.

#### plugins

- Required: `false`
- Type: `Array<String>`

Array of `npm` modules that expose Metal components.

Exmaple:

```js
ssg.registerTasks({
	gulp: gulp,
	plugins: ['metal-ssg-components']
});
```

The components found in the `metal-ssg-components` package will now be available
to all `soy` files in your project.

Note that every package listed in `plugins` must also be listed as a dependency
in the project's `package.json`.

#### taskPrefix

- Required: `false`
- Type: `String`

String that is prefixed to every task exposed by `metal-ssg`.

Exmaple:

```js
ssg.registerTasks({
	gulp: gulp,
	taskPrefix: 'ssg:'
});
```

The `generate` task will now be exposed as `ssg:generate`. This option allows
you to implement `metal-ssg` in conjunction with other packages that
expose `gulp` tasks without the risk of overwriting previously defined tasks.

</article>
