---
id: static-analysis
title: Static Android analysis
sidebar_position: 2
description: Inspect manifests, resources, DEX, Java/Kotlin-like output, and smali without running the app.
---

# Static Android analysis

Use this route when the package contains ordinary Android resources and meaningful DEX. It is safe to begin here even when later evidence points to native or dynamic work.

## Create complementary outputs

```bash
mkdir -p output/{apktool,jadx,reports}
apktool d -f sample.apk -o output/apktool
jadx -d output/jadx sample.apk
apkid sample.apk | tee output/reports/apkid.txt
```

These outputs answer different questions:

| Output | Best for | Important limitation |
|---|---|---|
| Raw ZIP | exact packaged files and signatures | binary XML/resources are not readable |
| apktool | manifest, resources, smali, rebuilding | no high-level source reconstruction |
| jadx | navigation, search, Java/Kotlin-like logic | may simplify or mis-decompile bytecode |
| APKiD | compiler/protector hints | signatures can be incomplete or ambiguous |

## Start with the manifest

Build an entry-point map before reading classes at random.

1. Record the custom `Application` class.
2. Find the launcher activity and intent filters.
3. List components with `android:exported="true"`.
4. Note component-level permissions and custom permission protection levels.
5. Record services, receivers, providers, deep links, and authorities.
6. Check `usesCleartextTraffic`, `networkSecurityConfig`, `debuggable`, and backup/data-extraction rules.

Map class names from the manifest into jadx and smali. Manifest component names are valuable anchors because Android must still instantiate them even when much of the app is obfuscated.

## Read resources as behavior clues

Resources often reveal behavior faster than code:

- URLs and hostnames in `res/values/strings.xml`;
- deep links and navigation graphs;
- XML preferences and feature switches;
- FileProvider paths;
- network security trust anchors;
- bundled certificates, databases, WebView assets, and configuration.

Search all decoded text, not just `strings.xml`:

```bash
rg -n --hidden -i 'https?://|api[_-]?key|client[_-]?id|webview|deeplink' \
  output/apktool/res output/apktool/assets
```

A matched string is a lead. Determine whether it is reachable and whether it is a real secret, a public identifier, test data, or unused library content.

## Navigate source-like output

A productive order is:

1. application startup (`Application`, content providers, dependency initialization);
2. manifest entry points;
3. code matching the user's feature or observed UI string;
4. network clients and persistence boundaries;
5. native method declarations and class loaders;
6. library code only when an app call reaches it.

Useful searches:

```bash
rg -n 'System\.loadLibrary|native +[A-Za-z]|DexClassLoader|InMemoryDexClassLoader' output/jadx/sources
rg -n 'setJavaScriptEnabled|addJavascriptInterface|shouldOverrideUrlLoading' output/jadx/sources
rg -n 'SharedPreferences|RoomDatabase|SQLiteDatabase|KeyStore' output/jadx/sources
```

Avoid assigning meaning to a class solely from its obfuscated name. Interfaces, superclasses, call sites, strings, and manifest roles are stronger evidence.

## Verify against smali

Decompiler output can be invalid or subtly wrong. Cross-check when:

- jadx inserts `failed to decompile` or warns about inconsistent code;
- a condition appears inverted or impossible;
- exception handling matters;
- an optimized Kotlin coroutine looks discontinuous;
- control flow decides a security-sensitive outcome;
- two high-level views disagree.

Smali concepts worth recognizing:

```smali
invoke-virtual {v0, v1}, Lcom/example/Client;->send(Ljava/lang/String;)V
move-result-object v2
if-eqz v2, :failure
const-string v3, "ready"
```

This records calls, descriptors, registers, and branches without pretending the original local variables or syntax survived. Use the [glossary](../reference/glossary.md) for common DEX terms.

## Handle multidex correctly

Modern applications commonly contain `classes2.dex` and beyond. jadx normally loads all DEX entries from an APK. With lower-level tooling, verify that every relevant DEX was included.

```bash
unzip -l sample.apk 'classes*.dex'
```

An apparently missing class may be in another DEX, generated at runtime, supplied by a split APK, or removed/inlined by optimization.

## Build an evidence map

Keep notes traceable:

| Claim | Evidence | Confidence | Verification |
|---|---|---|---|
| Deep link reaches `CheckoutActivity` | manifest filter + class call graph | high | invoke on lab device if in scope |
| Token is stored in preferences | write call in two decompilers | high | inspect test-account storage |
| Native check gates feature | Java native declaration + call branch | medium | map JNI registration |

Prefer class descriptors, resource names, method signatures, and line/file paths over screenshots alone.

## Know when to branch

Switch routes when evidence shows:

- JNI declarations or substantial application libraries → [native analysis](./native-analysis.md);
- framework-specific payloads → [managed frameworks](./managed-frameworks.md);
- encrypted strings or aggressive control flow → [deobfuscation](./deobfuscation.md);
- a loader stub or runtime-generated code → [dynamic fallback](./dynamic-analysis.md).
