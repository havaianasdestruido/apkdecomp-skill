# Decompiler Selection Matrix

No single decompiler is best for every APK. Pick based on **era**, **build
toolchain**, and **obfuscation/protection level**, in that order.

## 1. By era / build toolchain

| Era / toolchain | Typical traits | Best first tool | Notes |
|---|---|---|---|
| Pre-2013, plain Java, no/basic ProGuard | Small single `classes.dex`, simple control flow | `dex2jar` + `jd-gui` | Old-school pipeline still works fine here; jadx also works and is usually faster to set up today. |
| 2013–2018, standard ProGuard-shrunk apps | Renamed classes/fields (`a.a.a`), still structurally simple | `jadx` (primary), `apktool` for resources | jadx handles standard ProGuard output well; short names are cosmetic, not structural obfuscation. |
| 2016+, Kotlin-heavy apps | Synthetic lambdas, `Metadata` annotations, coroutines state machines | `jadx` | jadx has decent Kotlin support; expect messy output around coroutines/lambdas regardless of tool — read smali directly (`apktool`) if jadx output is confusing. |
| Multidex / very large apps (many `classesN.dex`) | 2+ DEX files | `jadx` (merges dex files) or `apktool` | Make sure your tool version supports multidex merging; older `dex2jar` builds sometimes don't. |
| Flutter apps | Dart compiled to native `libapp.so` (ARM), Java/Kotlin shell is trivial | Standard tools show almost nothing useful in DEX | Real logic is in `libapp.so`; use `Ghidra` + Flutter-specific tooling (e.g. `reFlutter`, blutter) rather than a DEX decompiler. |
| React Native apps | JS bundle inside `assets/index.android.bundle` (often Hermes bytecode) | Extract the bundle directly | If plain JS, just read it (minified). If Hermes bytecode, use a Hermes disassembler/decompiler (e.g. `hermes-dec`), not a Java decompiler. |
| Xamarin/.NET (MAUI) apps | `.dll` assemblies embedded under `assemblies/` | Standard .NET decompiler | Use `ILSpy`/`dnSpy`/`dotPeek` on the extracted DLLs, not a DEX tool. |
| Unity apps (IL2CPP) | Logic compiled to native `libil2cpp.so` + `global-metadata.dat` | `Il2CppDumper` + `Ghidra`/`IDA` | DEX decompilation shows only Unity's Java shim; the real game logic is native. |
| Unity apps (Mono scripting backend) | Managed `.dll`s under `assets/bin/Data/Managed` | Standard .NET decompiler | Much easier than IL2CPP — just decompile the DLLs with ILSpy/dnSpy. |

## 2. By obfuscation / protection level

| Level | Signs | Approach |
|---|---|---|
| **None / default ProGuard** | Class/method names shortened but structure intact; `mapping.txt` may exist from the developer | `jadx` alone is usually sufficient. If you have `mapping.txt`, run it through `retrace` for readable names. |
| **R8 (modern default, AGP 3.4+)** | Similar to ProGuard but more aggressive inlining; sometimes `-keep`-broken traces | `jadx`; expect some methods to be missing/inlined — cross-check confusing spots against smali via `apktool`. |
| **Commercial name/string obfuscators** (DexGuard, Allatori) | Encrypted string constants decrypted at runtime, reflection-heavy calls, junk classes | `jadx` gets you structure, but strings will be gibberish until decrypted. Locate the decryption routine and either reimplement it standalone or dump strings at runtime with `Frida`. `JEB` (paid) often decompiles through more of this cleanly than free tools. |
| **Control-flow obfuscation / opaque predicates** | jadx/CFR output has bizarre `if(true)`-style branches, huge switch dispatchers | Run `simplify` on the smali/dex first to flatten obfuscated control flow, then re-run your decompiler. |
| **Full packers / virtualization** (Bangcle/SecShell, Qihoo 360 Jiagu, Tencent Legu, Baidu, Ijiami, APKProtect) | Real `classes.dex` is tiny/stub; actual code is decrypted and loaded into memory at runtime, often via native `.so` loaders | Static decompilation of the APK as-shipped will show almost nothing. Use dynamic dumping: run the app on a rooted device/emulator with `Frida`/`frida-dexdump`/`objection` to dump the real DEX from memory after it unpacks itself, then decompile that dump normally. See `references/dynamic-analysis.md`. |
| **Anti-debug / anti-Frida / root detection** | App force-closes on rooted devices or when Frida is attached | Bypass detection first (Frida scripts like `frida-multiple-unpin`, hooking `Debug.isDebuggerConnected`, patching `su` checks) before attempting dynamic dumping. This is a rabbit hole — scope it explicitly with the user before going deep. |

## 3. Cross-checking strategy

Decompilers can silently produce *wrong* output (especially on obfuscated code)
rather than failing loudly. When something looks off:

1. Open the same method in **smali** via `apktool` — this is closest to ground
   truth (still bytecode, but not "guessed" back into Java syntax).
2. Try a **second decompiler** (e.g. compare `jadx` output against `CFR` or
   `Procyon` output for the same class via **Bytecode Viewer**, which runs
   several engines side by side).
3. If they disagree, trust the smali and reason about what Java/Kotlin source
   would actually compile to that bytecode.

## 4. Recommended default pipeline (when in doubt)

```
apktool d app.apk -o app_apktool        # manifest, resources, smali
jadx -d app_jadx app.apk                # best-effort Java/Kotlin source
apkid app.apk                           # what obfuscator/compiler is this?
```
Then branch based on what `apkid` and a skim of the jadx output reveal, using
the tables above.
