---
# Copy this file to e.g. `my-post-title.md` (no leading underscore) to publish.
# The filename becomes the URL: /blog/my-post-title/
title: "Post title"
description: "One or two sentences shown in lists, RSS and link previews."
pubDate: 2026-01-01
# updatedDate: 2026-02-01
tags: [android, frida]       # the first tag is printed on the generated cover
# cover: ./images/my-post.png  # optional: your own cover (path relative to this file).
# coverAlt: "What the image shows"
#                              # Without `cover`, a unique cover is generated from the title.
draft: true   # visible in `npm run dev`, hidden in the build until set to false
---

Write in Markdown. Code blocks get syntax highlighting and a copy button:

```js
Java.perform(() => {
  const Cls = Java.use('com.example.Target');
  Cls.check.implementation = function () {
    return true;
  };
});
```
