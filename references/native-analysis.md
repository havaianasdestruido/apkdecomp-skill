# Native (`.so`) Analysis

Relevant when `lib/<abi>/*.so` is present and the DEX-level logic looks like a
thin shim (common with Flutter, Unity IL2CPP, and any app doing security-
sensitive work in native code on purpose).

## 1. Identify the ABI(s) shipped

```
lib/armeabi-v7a/   # 32-bit ARM
lib/arm64-v8a/     # 64-bit ARM (most modern devices)
lib/x86/, lib/x86_64/  # emulator/Chromebook targets
```
Pick `arm64-v8a` for analysis unless you have a specific reason to target
another ABI — it's what most real devices run today.

## 2. Find the JNI entry points

```bash
nm -D libnative.so | grep Java_          # explicit JNI_OnLoad-style exports
```
If `JNI_OnLoad` is present and does *dynamic* `RegisterNatives` calls instead
of relying on `Java_...` symbol naming, exported symbols won't show the
mapping directly — you'll need to find the `RegisterNatives` call in the
disassembly and read the method table it registers.

## 3. Disassemble/decompile

- **Ghidra** (free): import the `.so`, let auto-analysis run, then navigate
  from the JNI exports. Ghidra's decompiler view gives C-like pseudocode.
- **IDA Pro** (commercial): generally better decompilation quality and has the
  Hex-Rays decompiler for ARM; worth it for heavy native RE work.

## 4. Special cases

- **Flutter (`libapp.so` / `libflutter.so`)**: this isn't "normal" native code,
  it's compiled Dart. Standard C disassembly is much less useful than
  Flutter-specific tooling (e.g. `reFlutter`, `blutter`) that understands
  Dart's snapshot format and can recover something closer to original Dart
  source/structure.
- **Unity IL2CPP (`libil2cpp.so` + `global-metadata.dat`)**: use
  `Il2CppDumper` first — it cross-references the metadata file against the
  `.so` to regenerate C# type/method signatures and a much more navigable
  header set for Ghidra/IDA, rather than reading raw IL2CPP-generated C++.
- **Packed/encrypted `.so` (native packers)**: some protection systems encrypt
  the native library itself and decrypt it in memory at load time. If static
  analysis shows garbage, dump the library from a running process's memory
  instead (e.g. via Frida's `Memory.readByteArray` on the loaded module base,
  or a memory-dumping Frida script) rather than trying to statically decrypt
  it.
