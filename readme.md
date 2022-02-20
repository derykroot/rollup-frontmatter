# `@mdx-js/rollup-frontmatter`

Rollup plugin for MDX derived from https://github.com/mdx-js/mdx/tree/main/packages/rollup with data yaml extraction support.



npm install:

```sh

npm install github:derykroot/rollup-frontmatter

```

## Use

Add something along these lines to your `rollup.config.js`:

```js
import mdx from '@mdx-js/rollup-frontmatter'

export default {
  // …
  plugins: [
    // …
    mdx({/* Options… */})
  ]
}
```

## Additional Feature over @mdx-js/rollup

Extract frontmatter yaml from mdx

```
---
title: title yaml!
date: "2022-01-01T22:12:03.284Z"
description: "title yaml extracted from mdx"
---

import { Counter } from "../../index/Counter.tsx"

# Hi , World! Goodbay <Counter />
```

Extract Metada example

```js
import * as Post from '../blog/posts/post.page.mdx';

function MetadataFromPost() {
  console.log(Post.mdata);
}
```

## Output

```js
{
  title: 'title yaml!',
  date: '2022-01-01T22:12:03.284Z',
  description: 'title yaml extracted from mdx'
}
```
