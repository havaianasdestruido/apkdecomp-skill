---
id: dynamic-analysis
title: Dynamic analysis fallback
sidebar_position: 6
description: Prepare a controlled Frida lab and collect the narrowest runtime evidence needed when static analysis reaches a boundary.
---

# Dynamic analysis fallback

Dynamic analysis is a fallback for a specific unresolved question—not an automatic escalation. Use it when static evidence shows runtime unpacking, environment-derived string decryption, reflective loading, or behavior that cannot be resolved from packaged artifacts.

## Preconditions

Confirm all of the following:

- the application is owned or explicitly authorized for runtime instrumentation;
- the test plan allows rooting, hooking, memory capture, and any bypass under consideration;
- the device/emulator and accounts contain no unrelated real-user data;
- the target will not contact production systems unless that is explicitly allowed;
- retention rules cover dumps, logs, and recovered plaintext.

Review [Responsible use](../responsible-use.md) before proceeding.

## Build a controlled lab

A typical setup includes:

- rooted Android emulator or dedicated rooted device;
- a snapshot that can be restored;
- test network controls and synthetic accounts;
- host `frida-tools` and device `frida-server` with **matching versions**;
- the exact target hash installed from the authorized build;
- timestamped notes for commands, PIDs, and outputs.

Check versions first:

```bash
frida --version
adb shell /data/local/tmp/frida-server --version
```

A mismatch is one of the most common causes of attach/spawn failures.

## Choose the narrowest observation

| Question | Narrow observation |
|---|---|
| What plaintext does this decoder return? | hook that method's return value |
| Which class is loaded from an encrypted payload? | observe `DexClassLoader`/`InMemoryDexClassLoader` construction |
| What DEX is present only after startup? | dump the relevant in-memory DEX after loading |
| Which JNI implementation is called? | trace the bridge or registration, not the entire process |
| Is a static branch reachable? | log entry/return for the specific method |

Minimizing hooks reduces noise, side effects, and sensitive collection.

## Spawn early when initialization matters

List targets and spawn when unpacking occurs before normal attachment:

```bash
frida-ps -Uai
frida -U -f com.example.app -l observe.js
```

Depending on Frida version and script behavior, resume the spawned process as required. `objection` can provide an interactive exploration layer:

```bash
objection -g com.example.app explore
```

Capture the exact command and tool versions; runtime APIs evolve.

## Dump runtime-loaded DEX only when needed

After the target has loaded or unpacked the relevant classes, an authorized lab can use a compatible DEX-dumping tool, for example:

```bash
frida-dexdump -U -p <pid>
```

Then:

1. hash every dump;
2. identify valid DEX files and class coverage;
3. keep provenance linking dump, PID, timestamp, package hash, and device image;
4. open the dumps in jadx/apktool as new evidence;
5. expect ordinary R8/ProGuard obfuscation to remain.

A successful dump recovers runtime bytecode—not original source and not necessarily every dynamically generated method.

## Treat anti-instrumentation as a scope change

An app that exits under root or Frida may be reacting to:

- mismatched Frida versions or setup errors;
- root/emulator checks;
- debugger checks;
- process, port, file, or thread-name fingerprints;
- integrity/attestation controls;
- server-side policy.

Do not immediately stack generic bypass scripts. First establish which check fires. Any bypass should be authorized, narrow, documented, and limited to the lab. If integrity or remote attestation is outside scope, stop and report the boundary.

:::danger Do not use real credentials or production users
Runtime hooks can expose tokens, plaintext, and personal data. Use test identities and redact logs by default.
:::

## Return runtime evidence to the static model

Dynamic evidence is most useful when mapped back to stable artifacts:

```text
Runtime observation: decoder returned "api.example.test".
Hook point: La/b;->c(Ljava/lang/String;)Ljava/lang/String;
Package hash: …
Device/build: emulator snapshot …
Static cross-reference: called from NetworkConfig.<clinit> at smali path …
```

The result should narrow the model, not replace it with an unsearchable terminal transcript.

## Stop conditions

Stop when the authorized question is answered, when collected data exceeds need, when a production dependency appears, or when the next bypass falls outside scope. Record the unresolved boundary instead of treating escalation as mandatory.
