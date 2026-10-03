---
id: glossary
title: Glossary
sidebar_position: 5
description: Definitions for Android packaging, DEX, resources, optimization, native code, and dynamic analysis terms.
---

# Glossary

## Packaging and resources

**AAB (Android App Bundle)**

Publishing format containing modules and configuration from which app stores or `bundletool` generate APKs. It is not normally installed directly.

**APK**

ZIP-based Android application package containing a manifest, resources, DEX, assets, signatures, and optionally native libraries.

**APK set / APKS**

Archive produced by `bundletool` containing APKs for multiple or specific device configurations.

**Base APK**

The primary package in a split installation. It normally contains the manifest and core code/resources.

**Split APK**

An additional package delivering an ABI, density, locale, feature module, or other configuration alongside a base APK.

**`resources.arsc`**

Compiled resource table mapping numeric resource IDs to values and configurations.

**Binary XML**

Android's packaged XML representation. Files such as `AndroidManifest.xml` are not plain text in a built APK.

## DEX and code

**DEX (Dalvik Executable)**

Android bytecode format stored in `classes.dex` and optional `classesN.dex` files.

**Multidex**

An application with more than one DEX file, usually because of method/reference scale or build configuration.

**Smali / baksmali**

Assembly-like representation and assembler/disassembler ecosystem for DEX. Smali stays closer to bytecode semantics than reconstructed Java.

**Class descriptor**

DEX/JVM notation such as `Lcom/example/Client;` or method descriptor `([B)Z` (byte-array argument, boolean return).

**Decompiler**

Tool that reconstructs higher-level source-like code from bytecode or machine code. Output is an interpretation, not original source.

**Disassembler**

Tool that maps bytecode or machine code to instruction-level text without reconstructing high-level source structures.

## Optimization and protection

**ProGuard**

Shrinker/optimizer/obfuscator historically used for Android and Java. It can rename symbols and remove or rewrite code.

**R8**

Modern Android shrinker, optimizer, and obfuscator integrated into Android build tooling; it also performs DEX compilation roles historically associated with D8/ProGuard pipelines.

**`mapping.txt`**

Build output mapping original names/positions to obfuscated output. It must match the exact build to be reliable.

**Obfuscation**

Transformation intended to make analysis harder, including renaming, string encryption, reflection, and control-flow changes.

**Packer / protector**

System that wraps or encrypts code and loads/decrypts it at runtime. Packaged DEX may be only a loader stub.

**Opaque predicate**

A condition designed to look variable to an analyst but resolve predictably, adding misleading control-flow branches.

**Virtualization**

Protection that translates original logic into a custom instruction set interpreted by a bundled virtual machine.

## Native and frameworks

**ABI (Application Binary Interface)**

Machine architecture/calling convention target such as `arm64-v8a`, `armeabi-v7a`, or `x86_64`.

**ELF**

Executable and Linkable Format used for Android native shared libraries (`.so`).

**JNI (Java Native Interface)**

Bridge between Java/Kotlin runtime code and native C/C++ functions.

**`JNI_OnLoad`**

Optional native entry point called when a library is loaded; often used to initialize state or register native methods.

**`RegisterNatives`**

JNI API for mapping Java native method names/descriptors to function pointers dynamically.

**AOT (ahead-of-time) compilation**

Compilation into machine code before execution. Flutter release Dart and Unity IL2CPP are important Android examples.

**Hermes**

JavaScript engine commonly used by React Native; release bundles may contain Hermes bytecode rather than source text.

**IL2CPP**

Unity backend that converts managed IL/C# into C++ and native code, paired with runtime metadata.

## Dynamic analysis

**Hook**

Runtime interception of a function/method to observe or alter arguments, return values, or behavior.

**Spawn vs. attach**

Spawn starts a process under instrumentation from launch; attach connects to an already running process. Early initialization/unpacking often requires spawn.

**Runtime DEX dump**

Copy of DEX bytes from a process after a packer or loader has made them available in memory.

**ASLR (Address Space Layout Randomization)**

Runtime relocation that changes module addresses between process launches. Report module-relative offsets when possible.

**Frida**

Dynamic instrumentation toolkit used to observe applications in controlled, authorized environments.

**Objection**

Exploration toolkit built on Frida that exposes common mobile runtime inspection tasks through an interactive interface.
