---
id: responsible-use
title: Responsible use
sidebar_position: 4
description: Authorization, lab boundaries, prohibited outcomes, and safe reporting for Android analysis.
---

# Responsible use

Android reverse engineering is dual-use. APKDecomp is intended to support legitimate engineering and security work while keeping authorization, scope, and impact visible.

## Appropriate uses

Examples include:

- analyzing an application you wrote or own;
- performing a security assessment under an explicit statement of work;
- investigating malware in an isolated research environment;
- compatibility, accessibility, migration, and interoperability research;
- validating what a vendor-provided SDK does inside your application;
- recovering behavior from software when you hold the rights to do so;
- learning with purpose-built challenge applications or open-source APKs.

## Requests the skill should not advance

Do not use this workflow to:

- bypass licensing, subscriptions, DRM, or paid feature controls in someone else's software;
- repackage, impersonate, or redistribute an application without permission;
- remove anti-tamper controls to facilitate piracy or unauthorized modification;
- extract credentials, private user data, signing material, or proprietary secrets without authority;
- deploy hooks or modified packages against production users or systems outside the assessment scope.

When a request combines legitimate and illegitimate goals, decline the harmful part while preserving safe help—for example, explaining general APK structure or testing the same concept in a deliberately vulnerable training app.

## Establish authorization

Before analysis, record:

| Question | Example evidence |
|---|---|
| Who owns the target? | Your organization, a customer named in the engagement, or an open-source project |
| What is allowed? | Static inspection only, runtime instrumentation, modification, network testing |
| Which build is in scope? | SHA-256, package name, version code, acquisition source |
| Where may it run? | Named emulator, lab device, isolated network |
| What must not be collected? | Real credentials, customer records, production tokens |
| When does authorization end? | Engagement date or test window |

A hash is particularly useful because package names and filenames are not unique.

```bash
sha256sum sample.apk
```

## Use a controlled lab

For dynamic analysis:

- use a dedicated emulator or test device;
- use test accounts and synthetic data;
- separate the lab from production networks;
- snapshot before installation;
- capture tool and server versions;
- remove the target and recovered artifacts when retention ends.

Treat dumped DEX, decompiled source, runtime strings, and memory captures as potentially sensitive. Store them according to the same rules as original source code or assessment evidence.

:::warning Runtime bypasses are not a default step
Root-detection and anti-instrumentation bypasses can change risk significantly. Only use them when runtime instrumentation is explicitly in scope and static analysis cannot answer the authorized question.
:::

## Report with restraint

A good report includes enough evidence for the owner to reproduce a finding but avoids publishing exploitable secrets. Prefer:

- hashes and versions over redistributing the APK;
- narrow excerpts over complete proprietary source trees;
- redacted tokens and personal data;
- clear separation between observed behavior and decompiler guesses;
- coordinated disclosure when a third party is affected.

## Stop conditions

Pause and re-scope when:

- ownership or permission cannot be established;
- the requested outcome shifts toward piracy, credential theft, surveillance, or unauthorized persistence;
- dynamic analysis would contact production systems or third-party users;
- the target contains sensitive data beyond the stated need;
- the required bypass is outside the engagement rules.

Legal requirements differ by jurisdiction. This project offers a technical workflow, not legal advice; consult qualified counsel when the authorization boundary is unclear.
