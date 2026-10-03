---
# Copy this file to e.g. `vendor-product-bug-class.md` (no leading underscore) to publish.
# Before publishing: the issue is fixed AND the program/vendor allows public disclosure.
title: "Stored XSS in Example Product admin panel"
description: "One sentence: what the bug is and what an attacker gets."
pubDate: 2026-01-01
vendor: "Example Corp"
product: "Example Product"
affected: "< 2.4.1"
fixed: "2.4.1"
cve: []            # e.g. ["CVE-2026-12345"]
severity: high     # critical | high | medium | low | info
status: fixed      # fixed | disclosed | wontfix
tags: [web, xss]
draft: true        # visible in `npm run dev`, hidden in the build until set to false
---

## Summary

Two or three sentences: the bug, where it is, and the impact you demonstrated.

## Details

Root cause and the vulnerable code path or request.

## Proof of concept

```http
POST /api/example HTTP/1.1
Host: target.example
Content-Type: application/json

{"name": "<img src=x onerror=alert(document.domain)>"}
```

## Impact

Only what the PoC proved.

## Timeline

| Date | Event |
|---|---|
| 2026-01-01 | Reported to vendor |
| 2026-01-05 | Triaged |
| 2026-02-01 | Fix released |
| 2026-03-01 | Public disclosure approved |
