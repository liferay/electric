# electric-cli

Command line tools for [electric](https://github.com/wedeploy/electric).

> Note: this CLI is only intended for electric `2.0.0`, it does not
support `1.x` projects.

## Install

```sh
$ npm i -g electric-cli
```

## Commands

You can see information for each supported command by typing `$ electric` in the command line.

### build

```sh
$ electric build
```

Builds electric site and places file in `dist` directory.

### init

```sh
$ electric init
```

Creates a new electric project.

### run

```sh
$ electric run
```

Runs the `build`, `watch`, and `server` commands for quick development.

### server

```sh
$ electric server
```

Starts up a local development server.

### watch

```sh
$ electric run
```

Watches for changes and triggers build.
