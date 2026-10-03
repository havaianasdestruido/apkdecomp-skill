---
id: tool-selection
title: Tool-selection matrix
sidebar_position: 1
description: Match Android era, framework, implementation layer, and protection level to a primary and verification tool.
---

# Tool-selection matrix

No decompiler is best for every Android package. Select by **implementation layer**, then **build/protection characteristics**, then operator preference.

## Default conventional-Android stack

When fingerprinting shows meaningful DEX and normal Android resources:

```bash
apktool d sample.apk -o output/apktool
jadx -d output/jadx sample.apk
apkid sample.apk
```

Use apktool for decoded resources and smali, jadx for navigation and high-level output, and APKiD for signatures. This is a baseline, not a promise that each tool will succeed.

## By implementation layer

| Evidence | Behavior likely lives in | Primary tools | Verification |
|---|---|---|---|
| ordinary `classes*.dex`, resources | Java/Kotlin DEX | jadx + apktool | smali; CFR/Procyon/JEB on disputed methods |
| `libapp.so`, `libflutter.so`, `flutter_assets` | AOT Dart + platform bridge | snapshot-aware Flutter tools; inspect embedding | Android bridge + native cross-reference |
| `index.android.bundle`, Hermes | JS/Hermes bytecode | text tooling or matching Hermes disassembler | Android native modules; source map if owned |
| `assemblies/*.dll`, Mono | .NET IL/managed assemblies | ILSpy, dnSpyEx, dotPeek | Android binding layer |
| Unity `Managed/*.dll` | managed C# | ILSpy/dnSpyEx | Unity assets/runtime behavior |
| `libil2cpp.so` + `global-metadata.dat` | IL2CPP native code | metadata extractor + Ghidra/IDA | matching build/version; runtime if scoped |
| application `.so` + JNI bridge | native ELF | Ghidra/IDA, binutils | Java declarations, RegisterNatives, disassembly |
| tiny loader DEX + protected payload | runtime-loaded DEX/native | loader/static analysis, then authorized runtime dump | hash/provenance and dumped DEX cross-check |

## By era and build toolchain

| Era / traits | Good first choice | Why / caveat |
|---|---|---|
| pre-2013 Java, single DEX | jadx or dex2jar + classic Java decompiler | legacy pipeline often works; modern jadx is easier to operate |
| ProGuard-era Java | jadx + apktool | names may be short but structure often remains readable |
| Kotlin/coroutines | jadx + smali | source-like output helps, but state machines and synthetic code remain noisy |
| modern R8/AGP | jadx + apktool | inlining and class merging can erase source boundaries |
| large multidex | jadx + apktool | ensure every DEX and relevant split is included |
| vendor/system APK | apktool with framework resources | OEM resource frameworks may be required |

APK metadata only gives a rough era. Repackaging, library ages, and target SDK policy can blur it.

## By protection level

| Protection | Signs | Route |
|---|---|---|
| none / name minification | readable constants and flow; short identifiers | jadx; use owned mapping when available |
| R8 optimization | inlining, merged classes, synthesized methods | compare call sites and smali; do not expect original boundaries |
| string encryption | wrapper around opaque constants | isolate decoder, reimplement or observe narrowly at runtime |
| reflection obfuscation | reconstructed names, reflective calls | trace builders and targets; collect runtime names only if needed |
| control-flow transformation | dispatch loops, opaque predicates, decompiler disagreement | smali, second engine, cautious simplification |
| commercial packer/virtualizer | loader stub, runtime DEX/native loader | identify loader; authorized dynamic extraction may be necessary |
| anti-debug/instrumentation | exits under debugger/root/Frida | establish trigger; treat bypass as separately scoped work |

## Tool strengths and limits

| Tool | Strength | Limit |
|---|---|---|
| apktool | resources, manifest, smali, rebuild workflows | no Java/Kotlin source reconstruction |
| jadx | fast navigation and Java-like output, multidex support | may fail or silently simplify difficult bytecode |
| dex2jar | bridge DEX into JVM decompiler ecosystem | conversion can lose unusual DEX semantics; multidex handling varies |
| CFR / Procyon | independent Java decompiler interpretation | usually consumes converted JAR, adding a conversion layer |
| Bytecode Viewer | side-by-side engines in one UI | not a substitute for original smali |
| JEB | strong commercial analysis and scripting | paid; output still needs verification |
| APKiD | quick signatures for compilers/protectors | signature coverage and certainty are limited |
| simplify | symbolic simplification of some obfuscation | can be slow/incomplete; preserve original evidence |
| Ghidra | free native disassembly/decompilation and scripting | auto-analysis and recovered types require review |
| IDA + Hex-Rays | mature native navigation/decompilation | commercial |
| Frida | targeted runtime observation | setup, side effects, detection, and authorization complexity |

## Cross-checking rule

Cross-check whenever the conclusion depends on exact branch semantics, error handling, cryptographic inputs, permission checks, or a decompiler warning.

1. Read the same method in original smali/disassembly.
2. Compare another decompiler when practical.
3. Trace callers and callees rather than isolating one pseudocode block.
4. Use runtime evidence only when static representations cannot resolve the question and scope allows it.
5. Report any remaining ambiguity.

## Selection record template

```text
Target hash:
Container/build clues:
Implementation layer:
Protection clues:
Primary tool + version:
Reason selected:
Verification tool/view:
Known limitation:
```

This short record makes later findings reproducible and explains why a different target may need a different pipeline.
