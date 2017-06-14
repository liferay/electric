---
description: "Getting started with a electric project."
icon: "arrow-right-rod"
layout: "docs"
title: "Getting Started"
weight: 1
---

<article id="electricCli">

## Electric CLI

### Install

```text/x-sh
npm i -g electric-cli
```

### Initialize Project

```text/x-sh
electric init
```

This will prompt you for a project id and name, then it creates a folder in your
current directory with your new `electric` project.

### Run

```text/x-sh
electric run
```

This will build your newly created project and start up a development server
along with a watch task for quickly making changes.

</article>

<article id="structure">

## Project Structure

Here is a basic example of an `electric` project.

```text/javascript
.
├── electric.config.js
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

## electric.config.js

This file provides configuration options to electric. It must always be located
in the root directory of your project.

See [configuration](/docs/configuration.html) for more information.

</article>

<article id="site_json">

## site.json

This file contains meta data about your project. Any property can be added to
this file. Front matter from all pages is merged with this data and passed to
every page as a soy param.

</article>

<article id="layouts">

## Layouts

The file structure of `layouts` is flexible, as soy uses the `namespace` of
every file as an identifier.

All layout files must be a soy template, and the only required layout is
`base.soy`.

See [layouts](/docs/layouts.html) for more information.

</article>

<article id="pages">

## Pages

Every file in `pages` with a `.soy` or `.md` extension is rendered to HTML
during the `build` command.

The file structure of `pages` determines the urls of your pages. For the above
example, the `child.md` file will be located at `/docs/parent/child.html` after
building.

Pages named `index` will be located at the path of it's parent directory,
so `pages/docs/index.soy` will be available at `/docs/`.

See [pages](/docs/pages.html) for more information.

</article>
