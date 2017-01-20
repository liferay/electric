---
description: "Creating and rendering Metal components."
icon: "module"
layout: "docs"
title: "Metal Components"
weight: 4
---

<article id="creating">

## Creating Components

One of the major benefits of `electric` is the ability to create metal.js
components and invoke them in your `soy` layouts and pages.

Components can exist anywhere in the `src` directory, for this example we will
place them inside `src/components`.

```bash
|--src/
   |--layouts/
	  |--base.soy
	  |--docs.soy
   |--pages/
	  |--index.soy
   |--components/
	  |--MyComponent.soy
	  |--MyComponent.js
```

`MyComponent.soy`.

```soy
&#123;namespace MyComponent&#125;

/**
 *
 */
&#123;template .render&#125;
	<div>Hello, World!</div>
&#123;/template&#125;
```

`MyComponent.js`.

```javascript
'use strict';

import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './MyComponent.soy';

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

```soy
---
description: "Page description."
title: "Page"
---

&#123;namespace page&#125;

/**
 *
 */
&#123;template .render&#125;
	<div>
		{call MyComponent.render /}
	</div>
&#123;/template&#125;
```

Now you should see 'MyComponent attached!' in the browser console.

</article>

<article id="metal_sgg_components">

## Electric Components

The [electric-components](https://github.com/liferay/electric-components) package
contains a number of components that are compatible with the site meta data,
such as navigation and search components.

See [configuration](/docs/configuration.html#options) for information on
adding `plugins` to your project.

These components are invoked the same way as your own components.

```soy
---
description: "Page description."
title: "Page"
---

&#123;namespace page&#125;

/**
 * @param site
 */
&#123;template .render&#125;
	<div>
		{call ElectricNavigation.render}
			{param depth: 1 /}
			{param section: $site.index /}
		{/call}
	</div>
&#123;/template&#125;
```

This will render a list with all direct descendants of the index page.

</article>
