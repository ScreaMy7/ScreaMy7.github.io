---
title: "Check reachability before you fuzz for a CVE"
pubDate: 2026-10-03
tags: [fuzzing, cve, llm]
draft: false
---
When I pick a known CVE to re-find by fuzzing, the question that matters isn't how bad the bug is or who found it. It's how many conditions a fuzzer has to satisfy at the same time to reach the vulnerable line. The only place to learn that is the source.

I learned this the expensive way with libxml2's **CVE-2025-24928**, a stack overflow in `xmlSnprintfElements`. My agent judged it shallow from the CVE text ("add more siblings") and from the fact that OSS-Fuzz found it. Neither of us opened the function. Two harnesses and about 1.5 hours later, no crash.

Reading the caller, `xmlValidateElementContent`, afterwards explained it. The vulnerable call only runs when:

- DTD validation is on, which is an optional feature,
- the element has a declared deterministic content model,
- its children violate that model,
- validation warnings are enabled,

and the overflow itself needs a namespace prefix of 10+ characters. That's a conjunction behind an optional flag. A fuzzer working from ordinary XML almost never satisfies all of it.

Compare [CVE-2017-11729 in libming](/blog/cve-2017-11729-libming-swftophp/): AFL++ with ASan re-found it in under 30 seconds. The vulnerable `OpCode` call, reached from `decompileINCR_DECR`, sits on `swftophp`'s mandatory decompile path, one small mutation away from a valid SWF.

What I do now, before spending any compute:

1. Open the vulnerable function **and its callers**. Count the conditions that gate the vulnerable line.
2. Few conditions on the default input path means shallow. A conjunction behind an optional flag means deep, so pick something else.
3. Prefer targets that were never in OSS-Fuzz. "OSS-Fuzz found it" means months of fuzzing at scale, not shallow. Hardened veterans like libxml2 and libpng had their shallow bugs removed years ago.
4. If coverage shows the caller half-covered and the target branch at zero, stop. That's a warning, not "mutation will get there."

With an agent in the loop, make it quote the guards from source before it commits to a target. It's a two-minute read, and here it would have changed the pick.
