---
description: "Creating and rendering Metal components."
icon: "module"
layout: "docs"
title: "Metal Components"
weight: 4
---

<article id="creating">

## Creating Components

One of the benefits of Electric is the ability to create Metal components
and invoke them in your `soy` layouts and pages.

Components should be placed in the the `src/partials` directory.

```text/javascript
.
└── src
    ├── partials
    │   ├── MyComponent.js
    │   └── MyComponent.soy
    ├── layouts
    │   ├── base.soy
    │   └── docs.soy
    └── pages
        └── index.soy
```

`MyComponent.soy`

```text/x-soy
&#123;namespace MyComponent&#125;

/**
 */
&#123;template .render&#125;
	<div>Hello, World!</div>
&#123;/template&#125;
```

`MyComponent.js`

```text/javascript
'use strict';

import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './MyComponent.soy.js';

class MyComponent extends Component {
	attached() {
		console.log('MyComponent attached!');
	}
};

Soy.register(MyComponent, templates);

export default MyComponent;
```

Now that you have the base component files, the `MyComponent` template simply
needs to be rendered in a page/layout.

</article>

<article id="rendering">

## Rendering Components

To render a metal component in a page/layout, simply use the `call` command to
render the `.render` template of the component.

```text/x-soy
---
description: "Page description."
title: "Page"
---

&#123;namespace page&#125;

/**
 */
&#123;template .render&#125;
	<div>
		{call MyComponent.render /}
	</div>
&#123;/template&#125;
```

Now you should see 'MyComponent attached!' in the browser console.

</article>

<article id="isomorphic">

## Isomorphic Components

Electric will render your Metal components both on the client and server sides.
This is a very powerful characteristic, but as Uncle Ben said *"With great power
comes great responsibility"*.

In order to make your components isomorphic, you may need to add some checks
before using **client-side only** properties such as `document` or `window`.

In the example below, we will import the `isServerSide` utility and use it during
Metal's lifecycle methods such as `attached` or `disposed`.

`MyComponent.js`

```text/javascript
'use strict';

import {isServerSide} from 'metal';
import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './MyComponent.soy.js';

class MyComponent extends Component {
	attached() {
		if (isServerSide()) {
			return;
		}

		console.log(document);
	}
};

Soy.register(MyComponent, templates);

export default MyComponent;
```

</article>

<article id="electric_components">

## Electric Components

The [electric-base-components](https://github.com/electricjs/electric/tree/master/packages/electric-base-components) package contains a number of components that are compatible with electric site meta
data, such as navigation and search components.

Currently these components come in two themes.

- [Marble](https://marblecss.com/): [electric-marble-components](https://github.com/electricjs/electric/tree/master/packages/electric-marble-components)
- [Clay](https://claycss.com/): [electric-clay-components](https://github.com/electricjs/electric/tree/master/packages/electric-clay-components)

These components are invoked the same way as your own components.

```text/x-soy
---
description: "Page description."
title: "Page"
---

&#123;namespace page&#125;

/**
 */
&#123;template .render&#125;
    {@param site: ?}

	<div>
		{call ElectricNavigation.render}
			{param depth: 1 /}
			{param section: $site.index /}
		{/call}
	</div>
&#123;/template&#125;
```

This will render a list with all direct descendants of the index page.

See [configuration](/docs/configuration#options) for more information.

</article>
