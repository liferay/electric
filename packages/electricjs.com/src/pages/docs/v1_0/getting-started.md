---
description: "Getting started with a electric project."
icon: "arrow-right-rod"
layout: "docsVOne"
title: "Getting Started"
weight: 1
---

<article id="yeoman">

## Yeoman Generator

The [Yeoman Generator](https://github.com/liferay/generator-electric) is
the fastest way to get an `electric` project up and running.

### Install dependencies

```shell
npm i -g gulp yo
```

### Install generator

```shell
npm i -g generator-electric
```

### Run generator

```shell
yo electric
```

This will prompt you for a project id and name, then it creates a folder in your
current directory with your new `electric` project.

Having issues getting the generator running? Check
out [Yeoman's FAQs](http://yeoman.io/learning/faq.html) for troubleshooting
tips.

### Build

All `gulp` commands should be run from your project root.

```shell
gulp
```

This will run the default gulp task registered in your project's `gulpfile.js`,
which includes generating your site, starting up a development server, and
starting the `watch` task.

</article>

<article id="structure">

## Project Structure

Here is a basic example of an `electric` project.

```javascript
.
├── gulpfile.js
└── src
    ├── layouts
    │   ├── base.soy
    │   └── docs.soy
    ├── pages
    │   ├── docs
    │   │   ├── create.md
    │   │   ├── index.soy
    │   │   └── parent
    │   │       ├── child.md
    │   │       └── index.md
    │   └── index.soy
    └── site.json
```

</article>

<article id="site_json">

## site.json

This file contains meta data about your project. Any property can be added to
this file. Front matter from all pages is merged with this data and passed to
every page as a soy param.

</article>

<article id="layouts">

## Layouts

The file structure of `layouts` is flexible, as `soy` uses the `namespace` of
every file as an identifier.

All layout files must be a `soy` template, and the only required layout is
`base.soy`.

See [layouts](/docs/layouts.html) for more information.

</article>

<article id="pages">

## Pages

Every file in `pages` with a `.soy` or `.md` extension is rendered to HTML
during the `generate` task.

The file structure of `pages` determines the urls of your pages. For the above
example, the `child.md` file will be located at `/docs/parent/child.html` after
generating.

Pages named `index` will be located at the path of it's parent directory,
so `pages/docs/index.soy` will be available at `/docs/`.

See [pages](/docs/pages.html) for more information.

</article>
