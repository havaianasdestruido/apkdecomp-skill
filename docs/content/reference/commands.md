---
id: commands
title: Command reference
sidebar_position: 2
description: Copyable commands for package inventory, bundle extraction, static analysis, native reconnaissance, signing, and controlled runtime work.
---

# Command reference

Commands assume tools are installed and on `PATH`. Replace filenames and output paths deliberately; do not run examples on untrusted packages outside an isolated workspace.

## Preserve and inventory

```bash
sha256sum sample.apk | tee SHA256SUMS
file sample.apk
unzip -t sample.apk
unzip -l sample.apk | less
unzip -l sample.apk 'classes*.dex' 'lib/*/*.so'
```

Extract the raw archive:

```bash
mkdir -p output/raw
unzip -q sample.apk -d output/raw
```

## Package metadata

```bash
# Android SDK command-line tools
apkanalyzer manifest print sample.apk
aapt2 dump badging sample.apk
aapt2 dump permissions sample.apk

# Signature and certificate information
apksigner verify --verbose --print-certs sample.apk
```

## AAB and split packages

```bash
# Build a universal APK set from an owned app bundle.
# For reproducible signing, provide the release/test keystore options explicitly.
java -jar bundletool.jar build-apks \
  --bundle=app.aab \
  --output=app.apks \
  --mode=universal

unzip -q app.apks -d output/apks
unzip -q app.xapk -d output/xapk
```

For device-specific splits:

```bash
java -jar bundletool.jar get-device-spec \
  --output=device-spec.json
java -jar bundletool.jar build-apks \
  --bundle=app.aab \
  --output=app.apks \
  --device-spec=device-spec.json
```

## apktool

```bash
# Decode resources, manifest, and smali
apktool d -f sample.apk -o output/apktool

# Decode without resources when vendor resources are broken/missing
apktool d -f --no-res sample.apk -o output/apktool-no-res

# Install a vendor framework package when authorized/available
apktool if framework-res.apk

# Rebuild an intentionally modified working tree
apktool b output/apktool -o output/rebuilt-unsigned.apk
```

Rebuilding is not required for analysis. If an authorized test needs installation, align and sign with test credentials; never overwrite an original release:

```bash
zipalign -p -f 4 output/rebuilt-unsigned.apk output/rebuilt-aligned.apk
apksigner sign --ks test.keystore --out output/rebuilt-signed.apk \
  output/rebuilt-aligned.apk
apksigner verify --verbose --print-certs output/rebuilt-signed.apk
```

## jadx

```bash
jadx -d output/jadx sample.apk
jadx --show-bad-code -d output/jadx-with-bad-code sample.apk
jadx-gui sample.apk
```

Use `--show-bad-code` as diagnostic output, not as more trustworthy source.

## APKiD

```bash
apkid sample.apk | tee output/apkid.txt
apkid output/raw/classes.dex
```

## dex2jar and Java decompilers

```bash
d2j-dex2jar sample.apk -o output/sample.jar
java -jar cfr.jar output/sample.jar --outputdir output/cfr
procyon -jar output/sample.jar -o output/procyon
```

Verify that the converter included all relevant DEX. Prefer direct DEX views when conversion changes semantics.

## Search decoded outputs

```bash
# URLs, WebViews, dynamic loading, and native bridges
rg -n -i 'https?://|addJavascriptInterface|DexClassLoader|loadLibrary| native ' output/

# Manifest entry points
rg -n 'exported="true"|intent-filter|provider|receiver|service' \
  output/apktool/AndroidManifest.xml

# Exact class descriptor in smali
rg -n 'Lcom/example/Feature;' output/apktool/smali*
```

## Native libraries

```bash
file libnative.so
readelf -hW libnative.so
readelf -dW libnative.so
readelf -Ws libnative.so | less
nm -D --defined-only libnative.so | c++filt | less
nm -D --defined-only libnative.so | grep 'Java_'
strings -a -n 6 libnative.so | less
```

## R8/ProGuard retrace

```bash
# Use the mapping from the exact owned build.
retrace mapping.txt obfuscated-stacktrace.txt
```

Depending on the Android/R8 distribution, the executable may be a script or a Java class invocation. Record the R8 version used.

## Control-flow simplification

```bash
# Preserve original input and write to a separate output.
java -jar simplify.jar sample.apk -o output/sample-simplified.dex
```

Compare original and transformed bytecode before relying on a changed branch.

## Device and Frida lab

Only after authorization and lab setup:

```bash
adb devices -l
adb shell pm path com.example.app
frida --version
frida-ps -Uai
frida -U -f com.example.app -l observe.js
objection -g com.example.app explore
frida-dexdump -p <pid>
```

Host `frida-tools` and device `frida-server` must be compatible—normally the exact same version.

## Record tool versions

```bash
apktool --version
jadx --version
apkid --version
java -version
frida --version
```

Attach version output and target hash to findings; decompilation can change across releases.
