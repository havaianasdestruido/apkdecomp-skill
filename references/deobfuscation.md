# Deobfuscation Notes

## If a ProGuard/R8 `mapping.txt` is available

This only applies when the user has legitimate access to their own build's
mapping file (e.g. from their CI artifacts), not a third party's private
mapping file.

- Format: lines like `com.example.Foo -> a.a.a:` followed by indented member
  mappings. `retrace`/`ReTrace` (bundled with ProGuard, and Android Studio ships
  a version too) converts obfuscated stack traces back to original names.
- To rename an entire decompiled source tree, no single canonical tool exists;
  write a small script that parses `mapping.txt` into an
  `obfuscated_name -> original_name` map and does a project-wide rename. Do the
  classes first, then members — renaming members before classes creates
  ambiguous matches.

## If no mapping file exists

You're reading obfuscated names as-is. Focus on **behavior over naming**:

1. Rename things *yourself* as you understand them (`a` → `NetworkClient`) in
   your own notes/copy — don't expect the decompiler to know real names.
2. Use **structural clues**: implemented interfaces, `extends` targets from
   the Android framework (`Activity`, `Service`, `BroadcastReceiver`), and
   manifest-declared component names survive obfuscation (Android needs the
   real class names to instantiate components), so manifest cross-referencing
   recovers a lot of "anchor" classes for free.
3. **String constants** that weren't encrypted are often the fastest way to
   identify a class's purpose (log tags, URLs, SharedPreferences keys, intent
   extras) — grep the smali/jadx output for literals before reading logic
   line-by-line.
4. For **encrypted strings** (common in commercial obfuscators), find the
   decryption routine (usually a small static method called from a
   static initializer or wrapping every string literal) and either:
   - reimplement it in a standalone script and batch-decrypt all strings, or
   - hook it with Frida at runtime and log real values as the app runs.

## Control-flow obfuscation (opaque predicates, junk branches)

Run `simplify` (see `commands.md`) on the DEX/smali before decompiling to
source — it symbolically executes methods and removes dead/junk branches,
which dramatically improves what jadx/CFR/Procyon can produce afterward.
