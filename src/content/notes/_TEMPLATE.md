---
# Copy this file to e.g. `adb-pull-split-apks.md` (no leading underscore) to publish.
# Notes are short: a snippet, a one-liner, a gotcha. No description needed.
title: "Pull all split APKs for a package"
pubDate: 2026-01-01
tags: [android, adb]
draft: true
---

```sh
for p in $(adb shell pm path com.example.app | cut -d: -f2); do adb pull "$p"; done
```
