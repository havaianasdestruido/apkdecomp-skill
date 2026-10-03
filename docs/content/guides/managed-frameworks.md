---
id: managed-frameworks
title: Managed framework payloads
sidebar_position: 3
description: Recognize and route Flutter, React Native, Xamarin, and Unity applications without over-analyzing their DEX shims.
---

# Managed framework payloads

Cross-platform and game frameworks often ship a small Android host around a payload compiled for another runtime. Decompiling the host can be useful for permissions and platform bridges, but it may not expose the application behavior you need.

## Decision table

| Framework | Strong package clues | Main payload | Typical route |
|---|---|---|---|
| Flutter | `libflutter.so`, `libapp.so`, `flutter_assets/` | AOT Dart snapshot/native library | Flutter snapshot-aware tooling + native analysis |
| React Native | `index.android.bundle`, `libreactnative.so`, `libhermes.so` | JavaScript or Hermes bytecode | extract/disassemble bundle |
| Xamarin/.NET / MAUI | Mono libraries, `assemblies/*.dll` | .NET assemblies | ILSpy/dnSpy/dotPeek |
| Unity Mono | `assets/bin/Data/Managed/*.dll` | managed C# assemblies | .NET decompiler |
| Unity IL2CPP | `libil2cpp.so`, `global-metadata.dat` | native code + metadata | Il2CppDumper-style metadata recovery + Ghidra/IDA |

Framework versions and packaging layouts change. Confirm multiple clues rather than relying on one filename.

## Flutter

Flutter release builds usually compile Dart ahead of time. Android DEX contains the embedding, plugin registration, and platform-channel glue; application logic is commonly in `lib/<abi>/libapp.so` with Flutter assets alongside it.

Inventory:

```bash
unzip -l sample.apk | grep -E 'lib(app|flutter)\.so|flutter_assets'
```

Useful questions for the Android layer:

- Which plugins are registered?
- Which platform channels cross into Java/Kotlin?
- Which Android permissions and components exist?
- Which deep links or intent handlers reach Flutter?

For Dart structure, use tools that understand the matching Dart snapshot format, such as `blutter` or `reFlutter`, where authorized and compatible. Generic C decompilation of `libapp.so` can still show strings and native calls but will not reconstruct normal Dart source.

## React Native and Hermes

Locate the bundle:

```bash
unzip -l sample.apk | grep -E 'index\.android\.bundle|\.hbc$|hermes'
unzip -p sample.apk assets/index.android.bundle > index.android.bundle
file index.android.bundle
```

A plain bundle is JavaScript, usually minified. Format it and use source maps if the owner can provide the matching build artifact. A Hermes bundle is bytecode and needs a Hermes-compatible disassembler/decompiler matching its bytecode version.

Keep inspecting the Android host for:

- native modules and bridges;
- intent/deep-link handling;
- WebView or networking configuration;
- loaded native libraries.

Do not treat every Java package under `com.facebook.react` as application-owned code.

## Xamarin and .NET MAUI

Extract managed assemblies and open them with a modern .NET decompiler.

```bash
unzip -l sample.apk | grep -Ei 'assemblies/|mono|xamarin|\.dll$'
```

The useful output may be compressed or stored in framework-specific blobs rather than plain DLL files in newer builds. Use tooling compatible with the app's Xamarin/.NET Android packaging version to extract assemblies first.

Analyze Java/Kotlin only for Android bindings, exported components, and platform integration. Analyze C# assemblies for application flow.

## Unity Mono

Unity Mono builds commonly retain managed DLLs:

```text
assets/bin/Data/Managed/Assembly-CSharp.dll
```

`Assembly-CSharp.dll` is usually the highest-value game-specific assembly. Open it in ILSpy or another .NET decompiler. Engine and standard library assemblies provide context but can overwhelm search results.

Optimization and symbol stripping still apply, and asset bundles may hold configuration or scripts separately.

## Unity IL2CPP

IL2CPP converts managed code to C++ and then native machine code. Pair:

- `lib/<abi>/libil2cpp.so`
- `assets/bin/Data/Managed/Metadata/global-metadata.dat` (layout can vary)

Use a metadata recovery tool compatible with the Unity/metadata version to generate names, type information, and addresses, then import those results into Ghidra or IDA. Raw DEX only shows Unity's Android player shell.

If metadata and binary do not match, recovery will fail or produce incorrect addresses. Hash both and confirm they came from the same package and ABI.

## Avoid common routing mistakes

- **Mistake:** reading framework bootstrap DEX and concluding the app has no logic.<br />
  **Correction:** identify the framework payload first.
- **Mistake:** using a generic Java decompiler on Hermes or .NET artifacts.<br />
  **Correction:** match the tool to the runtime format.
- **Mistake:** mixing native binaries from one split/ABI with metadata from another build.<br />
  **Correction:** preserve package provenance and target one consistent build.
- **Mistake:** assuming all behavior is cross-platform.<br />
  **Correction:** still inspect Android bridges, exported components, and native plugins.

Continue with [Native library analysis](./native-analysis.md) for ELF/JNI details, or return to the [tool-selection matrix](../reference/tool-selection.md).
