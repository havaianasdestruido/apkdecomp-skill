---
id: getting-started
title: Getting started
sidebar_position: 2
description: Install the skill, verify its files, and run a first authorized package-analysis request.
---

# Getting started

Keep the repository structure intact, make the skill visible to your agent, and give the agent a concrete, authorized analysis goal.

## Requirements

The **skill itself** only needs a skills-compatible coding agent that can read Markdown. The tools used for a particular target are separate.

Recommended baseline for conventional APKs:

- `unzip` and `file`
- [apktool](https://apktool.org/) for resources, manifest, and smali
- [jadx](https://github.com/skylot/jadx) for Java/Kotlin-like source
- [APKiD](https://github.com/rednaga/APKiD) for compiler, packer, and obfuscator hints
- Android SDK Build Tools for `aapt2` and `apksigner`
- Android SDK Command-Line Tools for `apkanalyzer`

Do not install every specialist tool in advance. Add Ghidra, Frida, .NET decompilers, or framework-specific tooling only when fingerprinting points there.

## Install the skill

Clone the project into the skills directory used by your agent. The exact parent directory is client-specific; preserve the folder contents and relative paths.

```bash
git clone https://github.com/havaianasdestruido/apkdecomp-skill.git \
  apk-reverse-engineering
```

A valid installation contains at least:

```text
apk-reverse-engineering/
├── SKILL.md
└── references/
    ├── commands.md
    ├── decompiler-selection.md
    ├── deobfuscation.md
    ├── dynamic-analysis.md
    ├── native-analysis.md
    └── troubleshooting.md
```

For clients that support personal and project-level skills, use:

- a **personal** skills directory when you want the workflow available across projects;
- a **project** skills directory when the team should version and review it with one codebase.

Restart or reload the client if it only discovers skills at launch.

## Verify discovery

Ask a request that clearly matches the `SKILL.md` description:

> I own `sample.apk` and have authorization to assess it. Inventory the package, identify its compiler/protection, and recommend a static-analysis plan. Do not make changes to the APK.

A skill-guided response should do three things before diving into code:

1. acknowledge authorization and target format;
2. inspect or ask for structural evidence such as DEX count, `lib/`, assets, manifest SDK, and APKiD output;
3. consult the tool-selection matrix instead of blindly prescribing one decompiler.

:::tip Give the agent an outcome, not just a verb
“Identify the code responsible for this exported service” is more useful than “decompile this.” A bounded question helps the agent stop after collecting enough evidence.
:::

## Prepare a lab workspace

Never modify the only copy of a target. Hash it, make outputs explicit, and keep generated files out of the skill repository.

```bash
mkdir -p ~/lab/sample/{input,output,notes}
cp sample.apk ~/lab/sample/input/
cd ~/lab/sample
sha256sum input/sample.apk | tee notes/SHA256SUMS
```

A practical output layout is:

```text
output/
├── apktool/       # manifest, resources, smali
├── jadx/          # source-like output
├── extracted/     # raw ZIP contents
└── reports/       # APKiD, hashes, package metadata
```

## Run the first pass

For an ordinary APK, the minimum evidence-gathering pass is:

```bash
mkdir -p output/reports
unzip -l input/sample.apk | tee output/reports/archive-list.txt
apkid input/sample.apk | tee output/reports/apkid.txt
apktool d -f input/sample.apk -o output/apktool
jadx -d output/jadx input/sample.apk
```

Then ask the agent to summarize:

- package name, version, SDK range, and app type;
- permissions and exported components;
- DEX count and native ABIs;
- compiler, framework, and protection signals;
- recommended next question and verification method.

## Next steps

Use [Triage an Android package](./guides/triage.md) for the full decision path, or review [How the skill works](./how-it-works.md) to understand how `SKILL.md` and `references/` divide responsibility.
