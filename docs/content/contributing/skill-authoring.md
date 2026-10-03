---
id: skill-authoring
title: Authoring the skill
sidebar_position: 2
description: Maintain trigger metadata, core instructions, references, safety boundaries, and quality checks for the agent skill.
---

# Authoring the skill

The skill must be discoverable enough to activate on relevant requests and concise enough to guide an agent without flooding its context.

## Front matter

`SKILL.md` starts with YAML:

```yaml
---
name: apk-reverse-engineering
description: Use this skill whenever …
---
```

### `name`

Treat the name as a stable identifier. Changing it can break installations or user expectations.

### `description`

The description is both a summary and a trigger surface. It should include:

- user intents (“decompile,” “unpack,” “analyze native libraries”);
- target formats (APK, AAB, APKS, XAPK);
- distinctive tools/terms (`apktool`, `jadx`, smali, DEX, Ghidra);
- the behavior that distinguishes this skill (mandatory target fingerprinting and tool selection).

Avoid generic triggers that would activate for ordinary Android development.

## Core versus references

Put content in `SKILL.md` when the agent needs it on nearly every request:

- authorization boundary;
- intake/fingerprinting order;
- mandatory selection-matrix lookup;
- main analysis branches;
- incremental reporting expectation.

Put content in `references/` when it belongs to a branch:

- long command lists;
- tool-by-tool comparisons;
- native/JNI procedures;
- detailed deobfuscation;
- dynamic-lab setup;
- troubleshooting tables.

Reference links must remain relative to the skill root so copied installations work offline.

## Write operational instructions

Prefer instructions an agent can act on:

```markdown
Run `apkid` and inventory `classes*.dex`, `lib/`, and `assets/` before
selecting a decompiler. Cross-reference the result against
`references/decompiler-selection.md`.
```

Avoid vague prose:

```markdown
Use the best tools and be careful with obfuscation.
```

For each branch, explain the evidence that activates it, the expected output, and a stopping condition.

## Keep the safety boundary useful

Safety language should not be ceremonial. It should help the agent distinguish:

- authorized assessment from unauthorized tampering;
- interoperability/research from piracy or DRM bypass;
- isolated dynamic analysis from production interference;
- a legitimate subtask that can continue from a harmful requested outcome that must be declined.

Do not make all reverse engineering sound prohibited. State allowed cases clearly, then limit specific harmful outcomes.

## Evaluate changes with scenarios

Review the skill against representative requests:

### Should activate

- “I own this APK; recover the manifest and explain the exported service.”
- “Why does jadx show only a Flutter activity?”
- “Compare smali to the failed jadx output for this method.”
- “Our own R8 build crashes; use our mapping to retrace it.”
- “Map these JNI native methods in our test application.”

### Should not activate

- ordinary Android Studio build errors with source available;
- iOS IPA-only analysis;
- general Java source refactoring;
- browser JavaScript debugging unrelated to an APK.

### Should activate, then constrain/refuse

- requests to crack paid features or remove a third party's license checks;
- requests to repackage an app for deceptive distribution;
- dynamic collection against real users or unowned production systems.

## Review checklist

- Is the tool-selection reference still required before recommending a tool?
- Does every added specialist path have evidence that triggers it?
- Are original artifacts preserved before transformations?
- Are uncertain outputs identified as such?
- Do commands avoid embedding secrets or dangerous defaults?
- Do `SKILL.md` and `references/` use valid relative links?
- Is the public documentation updated where users need the change explained?
