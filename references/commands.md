# Command Reference

Assumes tools are installed and on `PATH`. Install notes at the bottom.

## Unpacking bundles/splits

```bash
# .aab (Android App Bundle) -> installable APKs, needs a keystore for signing
bundletool build-apks --bundle=app.aab --output=app.apks --mode=universal
unzip app.apks -d app_apks_extracted

# .apks / .xapk (already a zip of split APKs)
unzip app.xapk -d app_split
# base.apk inside has the manifest + most code; arch/density splits have
# native libs and resources for that config only.
```

## apktool (resources, manifest, smali)

```bash
apktool d app.apk -o app_apktool          # decode
# ...edit smali/resources...
apktool b app_apktool -o app_rebuilt.apk  # rebuild (for patching workflows)
# rebuilt APK needs re-signing before it will install:
apksigner sign --ks debug.keystore app_rebuilt.apk
```

## jadx (Java/Kotlin-ish source)

```bash
jadx -d app_jadx app.apk          # CLI, writes source to app_jadx/sources
jadx-gui app.apk                  # GUI, easier for interactive browsing/search
```

## dex2jar + classic Java decompilers

```bash
d2j-dex2jar app.apk -o app.jar
# then open app.jar in jd-gui, or decompile headlessly:
cfr app.jar --outputdir app_cfr_src
procyon -jar app.jar -o app_procyon_src
```

## Bytecode Viewer (multi-engine workbench)

```bash
java -jar bytecode-viewer.jar
# Load the APK/jar in the GUI; switch between CFR/Procyon/Fernflower/Krakatau
# panes on the same class to cross-check.
```

## apkid (fingerprint obfuscator/compiler/packer)

```bash
apkid app.apk
```

## ProGuard/R8 mapping deobfuscation

```bash
# mapping.txt is produced by the developer's build; you only have it if it
# leaked, was shipped by mistake, or the user is deobfuscating their own build.
retrace.sh mapping.txt obfuscated_stacktrace.txt   # for stack traces
# For renaming classes/methods throughout a decompiled source tree, there's no
# single official tool — common approach is a small script that parses
# mapping.txt (format: "original -> obfuscated:") and does a project-wide
# find/replace from obfuscated -> original names.
```

## simplify (deobfuscate control flow in smali/dex)

```bash
java -jar simplify.jar app.apk -o app_simplified.dex
```

## Native library analysis

```bash
file lib/arm64-v8a/libnative.so
nm -D lib/arm64-v8a/libnative.so | grep Java_    # exported JNI symbols
# Then open the .so in Ghidra or IDA for full disassembly/decompilation.
```

## Dynamic dumping with Frida (for packed/virtualized apps)

```bash
frida-ps -Uai                      # list installed apps on device/emulator
objection -g com.example.app explore
frida-dexdump -p <spawned_pid>     # dump in-memory DEX after app unpacks itself
```

## Install notes

- `apktool`, `jadx`, `dex2jar`, `apksigner`: available via package managers
  (`apt`, `brew`) or direct download from their GitHub release pages.
- `apkid`: `pip install apkid` (needs `yara-python`).
- `Bytecode Viewer`, `simplify`, `JEB`: distributed as standalone jars/binaries
  from their respective project pages; JEB is commercial.
- `Frida`/`objection`/`frida-dexdump`: `pip install frida-tools objection`, plus
  `frida-server` pushed to a rooted device or emulator matching your host
  Frida version exactly.
- `bundletool`: download the jar from Google's `bundletool` GitHub releases.
