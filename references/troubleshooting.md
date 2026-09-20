# Troubleshooting Common Failures

| Symptom | Likely cause | Fix |
|---|---|---|
| `apktool` fails on resource decoding with a framework/resource error | Custom `resources.arsc` values referencing a vendor framework (rare OEM apps), or a corrupted/edited APK | Try `apktool d --no-res` to skip resource decoding and get smali only; add missing framework with `apktool if <framework.apk>` if you have it. |
| jadx output has many `// jadx: failed to decompile` comments | Aggressive optimization/obfuscation confusing jadx's heuristics | Cross-check against smali directly (ground truth); try a different decompiler (CFR/Procyon via Bytecode Viewer) on the same class; try `simplify` first if it's control-flow obfuscation. |
| Rebuilt APK (`apktool b`) crashes on install/launch | Missing re-signing, or resource IDs shifted during edit | Always `apksigner sign` after rebuilding; if resources were added/removed, check `public.xml` for ID conflicts. |
| `dex2jar` produces a jar that JD-GUI can't open or shows empty classes | Multidex app but only `classes.dex` was converted | Convert all `classesN.dex` files and merge, or just switch to `jadx` which handles multidex automatically. |
| App looks totally different in the DEX than the UI suggests (almost no logic) | Flutter/Unity IL2CPP/Xamarin — the real logic isn't in DEX at all | Check `references/decompiler-selection.md` "by era/toolchain" table — you're decompiling the wrong layer. |
| Strings are readable garbage / base64-looking blobs everywhere | String encryption from a commercial obfuscator | See `references/deobfuscation.md` "encrypted strings" section. |
| `classes.dex` is a few KB and does almost nothing | Native packer/virtualizer stub | Switch to dynamic dumping — `references/dynamic-analysis.md`. |
| Frida won't attach / app closes immediately when Frida is running | Root/Frida detection | See the anti-detection bypass notes in `references/dynamic-analysis.md`; confirm `frida-server` version matches `frida-tools` exactly first, since version mismatch causes the same symptom. |
| Ghidra auto-analysis takes forever or produces poor pseudocode for a `.so` | Very large binary, or ARM thumb-mode detection issues | Let full auto-analysis finish once (can take a while on first import); manually mark thumb vs ARM at ambiguous function boundaries if disassembly looks garbled. |
| `Il2CppDumper` can't match metadata to the binary | Metadata/binary version mismatch, or a modified/patched build | Confirm both files came from the same APK build; try a different `Il2CppDumper` release matching the app's Unity version if the default fails. |
