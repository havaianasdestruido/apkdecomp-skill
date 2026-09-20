# Dynamic Analysis Fallback

Use this when static decompilation stalls: the shipped `classes.dex` is a tiny
stub, strings are encrypted with no findable key, or the app is wrapped by a
commercial packer/virtualizer.

Only do this against apps you're authorized to test — on your own device or a
controlled lab environment/emulator, not production infrastructure you don't
own.

## Prerequisites

- A **rooted** physical device or an emulator image with root (e.g. a rooted
  AVD, Genymotion, or a Corellium instance).
- `frida-server` on the device matching your host `frida-tools` version
  **exactly** (mismatches are the #1 cause of "it doesn't work").
- The target app installed.

## Typical flow

1. **Spawn, don't attach**, so you catch the unpacking as it happens:
   ```bash
   frida-ps -Uai                       # find the package name
   objection -g com.example.app explore   # spawns + gives an interactive shell
   ```
2. **Dump the real DEX after unpacking**, once the app has finished its
   self-decryption (give it a few seconds after launch, or hook the point
   where a `DexClassLoader`/`InMemoryDexClassLoader` is created):
   ```bash
   frida-dexdump -p <pid>
   ```
   This writes out the actual DEX bytes the app is running, which you then
   feed into `jadx`/`apktool` like a normal APK's classes.dex.
3. **If anti-Frida/root-detection blocks you first**, apply standard bypasses
   before the dump attempt — common building blocks:
   - `frida-multiple-unpin` style SSL-pinning/root-check bypass scripts.
   - Hooking `Debug.isDebuggerConnected`, `File.exists` checks for `su`, and
     `Runtime.exec` calls that shell out to detect root, to return benign
     values.
   - Renaming/hiding the Frida server process name and using a `frida-server`
     build patched to be less fingerprintable, if detection is aggressive.
   Treat this as its own mini-project — scope expectations with the user, it
   can take longer than the actual decompilation.
4. **For encrypted strings specifically**, instead of a full DEX dump you can
   hook just the decryption method and log its return value every time it's
   called, which recovers plaintext strings without needing to fully unpack
   the app.

## After the dump

Treat the dumped DEX exactly like a normal extracted `classes.dex`: run it
through `jadx`/`apktool` per `decompiler-selection.md`. It's common for the
dumped code to *still* have ProGuard/R8-style short names underneath the
packer — that's a separate, normal deobfuscation step (see
`deobfuscation.md`), not a sign the dump failed.
