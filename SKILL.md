---
name: apk-reverse-engineering
description: Use this skill whenever the user wants to decompile, unpack, disassemble, or reverse-engineer an Android APK (or AAB/APKS/XAPK) file — including recovering Java/Kotlin source, reading smali bytecode, extracting resources/manifest, analyzing native .so libraries, deobfuscating ProGuard/R8/DexGuard-protected code, or identifying which decompiler/toolchain fits a given APK's age and obfuscation level. Trigger on mentions of apktool, jadx, dex2jar, smali, baksmali, JEB, Bytecode Viewer, Ghidra for Android, APK unpacking, DEX analysis, or "how do I get the source code out of this APK". Always consult references/decompiler-selection.md before recommending a specific tool, since the right choice depends heavily on the app's release era and obfuscation/protection level.
---

# APK Reverse Engineering

A skill for decompiling and reverse-engineering Android APK files, choosing the
right toolchain based on the app's era, build system, and obfuscation/protection
level, and working through resources, DEX bytecode, and native libraries.

## Legitimate use only

This skill is for analyzing apps the user owns, has authorization to test, or is
studying for security research, interoperability, compatibility work, or general
learning. Do not use it to help bypass licensing/DRM on someone else's paid
software, to help repackage/pirate an app, or to strip anti-tampering from an app
without the rights to do so. If a request looks like it's aimed at any of that,
say so and decline the specific ask, while still being willing to help with the
legitimate parts (e.g., inspecting your own app, or general educational analysis).

## Workflow

1. **Identify the target.** Get the file (.apk, .aab, .apks, .xapk, .apkm). If
   it's a split-APK bundle (.apks/.xapk), unzip it first — you'll get a
   `base.apk` plus per-density/per-abi split APKs. Only `base.apk` (or the
   merged bundle) has the manifest and most DEX/code.

2. **Fingerprint it before picking a tool.** Don't guess — check:
   - `targetSdkVersion` / `compileSdkVersion` in the manifest → rough era.
   - Presence of `classes2.dex`, `classes3.dex`, etc. → multidex, larger/modern app.
   - Run `apkid` (or inspect strings/manifest) to detect known obfuscators/packers
     (ProGuard, R8, DexGuard, Allatori, Bangcle/SecShell, Qihoo 360, Tencent Legu,
     Baidu, NetEase, Ijiami, APKProtect, DexProtector, etc.) and compilers
     (Kotlin, Flutter, React Native, Xamarin/Mono, Unity/IL2CPP, Cordova).
   - Look for a `lib/` folder with `.so` files → native code is involved; DEX-only
     decompilation won't show that logic.
   - Cross-reference findings against `references/decompiler-selection.md` to pick
     the toolchain. **Do this lookup every time** — the right tool changes a lot
     depending on what you find.

3. **Unpack resources & manifest** — almost always start with `apktool d`. This
   gives readable `AndroidManifest.xml`, `res/`, and smali (not Java) even on
   apps that break every other decompiler.

4. **Get Java/Kotlin-like source** — use the tool selected in step 2 (typically
   `jadx`, `dex2jar` + a Java decompiler, `Bytecode Viewer`, or `JEB` for
   protected/virtualized code). Read `references/decompiler-selection.md` for
   which to reach for and why, and `references/troubleshooting.md` if a tool
   crashes, times out, or produces garbage output.

5. **Deobfuscate identifiers if a mapping file is available** — see
   `references/deobfuscation.md` for ProGuard/R8 `mapping.txt` usage
   (`retrace`/`re-trace`), and for approaches when no mapping exists.

6. **Handle native code separately if `lib/*.so` matters** — see
   `references/native-analysis.md` (Ghidra/IDA workflow, JNI method matching).

7. **Fall back to dynamic analysis when static analysis stalls** (heavy
   virtualization/packing, string encryption, anti-debug) — see
   `references/dynamic-analysis.md` for Frida-based unpacking/dumping.

8. Report findings incrementally — don't wait to decompile the entire APK
   before showing the user anything. Surface the manifest, package structure,
   and permissions early, then drill into the code they actually asked about.

## Quick tool cheat-sheet

| Need | Tool |
|---|---|
| Resources, manifest, smali, repack after edits | `apktool` |
| Best-effort Java/Kotlin source, fast, good UI/CLI | `jadx` / `jadx-gui` |
| Legacy dex→jar then classic Java decompiler | `dex2jar` + `jd-gui`/`cfr`/`procyon` |
| One workbench with multiple decompilers to cross-check | `Bytecode Viewer` |
| Best decompilation quality on obfuscated/commercial apps (paid) | `JEB Decompiler` |
| Deobfuscate control-flow/opaque predicates in smali | `simplify` |
| Identify packer/obfuscator/compiler used | `apkid` |
| ProGuard/R8 name deobfuscation with a mapping file | `retrace` / ReTrace / `proguard-retrace.jar` |
| Native `.so` (JNI) analysis | `Ghidra` (free) or `IDA Pro` |
| Runtime unpacking of packed/virtualized DEX | `Frida` + `frida-dexdump` / `objection` |
| Split bundle extraction | `bundletool` (for .aab), plain `unzip` (for .apks/.xapk) |

See `references/decompiler-selection.md` for the full decision matrix by era and
obfuscation level, `references/commands.md` for ready-to-run command examples,
and `references/troubleshooting.md` for common failure modes.
