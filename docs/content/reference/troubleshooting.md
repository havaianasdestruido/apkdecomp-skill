---
id: troubleshooting
title: Troubleshooting
sidebar_position: 4
description: Diagnose package decoding, source recovery, native analysis, Frida setup, and documentation build failures.
---

# Troubleshooting

Start with the failing layer. Preserve complete logs, target/tool versions, and hashes before changing inputs.

## Analysis tools

| Symptom | Likely cause | Next steps |
|---|---|---|
| apktool reports missing framework resources | vendor/OEM resource references | install the matching authorized framework with `apktool if`; or use `--no-res` to recover smali only |
| apktool cannot decode `resources.arsc` | corruption, protection, or unsupported format | test ZIP integrity, upgrade apktool, preserve raw resources, decode without resources |
| jadx shows `failed to decompile` | optimization/obfuscation or unsupported bytecode pattern | inspect smali, enable diagnostic bad-code output, try another engine on the method |
| jadx output contains impossible branches | decompiler reconstruction error or control-flow obfuscation | compare original smali and a second engine; do not “fix” source before verifying |
| dex2jar output misses classes | multidex or conversion failure | inventory all `classes*.dex`; prefer jadx/direct DEX tools |
| package has very little app code | managed framework, native-heavy app, split missing, or packer | inspect assets/libraries and use the triage decision tree |
| strings look encoded/encrypted | resource encoding or string obfuscator | find the repeated decoder and trace arguments; avoid bulk runtime collection |
| rebuilt APK will not install | signature mismatch, alignment, version/device constraints | use a test device, align/sign, inspect `adb install` error; rebuilding is not needed for static analysis |
| rebuilt APK installs but exits | integrity checks, changed resources, missing splits, or signing-dependent API | compare logs and package set; confirm modification is in scope |

## Bundles and splits

| Symptom | Likely cause | Next steps |
|---|---|---|
| base APK launches without native library | ABI library is in a split | include the matching config split or build a universal APK from the AAB |
| resources/classes appear missing | feature module or language/config split omitted | inventory the complete APK set and module metadata |
| bundletool rejects signing options | incomplete keystore arguments or unsupported JDK/tool pairing | read the matching bundletool help/version; use explicit test signing values |
| artifacts do not match device | wrong ABI, density, SDK, or locale spec | regenerate `device-spec.json` from the intended lab device |

## Native analysis

| Symptom | Likely cause | Next steps |
|---|---|---|
| `nm -D` shows almost nothing | symbols stripped or dynamic registration | inspect imports, `JNI_OnLoad`, strings, xrefs, and `RegisterNatives` |
| Ghidra uses the wrong language | architecture/endianness detection or raw blob import | confirm with `file`/`readelf`; re-import as ELF with the correct processor |
| decompiler types are nonsensical | stripped type data or incorrect signatures | verify calling convention and disassembly; apply types incrementally |
| IL2CPP metadata tool cannot match | binary/metadata version mismatch or protection | confirm same package/build/ABI and use a compatible tool version |
| static `.so` looks encrypted/empty | packed library or code generated/decrypted at runtime | inspect loader first; runtime dump only with explicit scope |

## Frida and device lab

| Symptom | Likely cause | Next steps |
|---|---|---|
| host cannot see device | ADB/USB/network setup | verify `adb devices -l`, authorization prompt, and transport |
| Frida cannot enumerate processes | server not running, wrong privilege, or version mismatch | compare exact versions, permissions, architecture, and server logs |
| app exits immediately on spawn | setup issue or anti-instrumentation | test uninstrumented launch, capture logcat, identify the specific check before bypassing |
| hook never fires | wrong process/class loader/signature or code path not reached | enumerate loaders, confirm overload and timing, trigger with a test action |
| dumped DEX will not open | memory fragment, bad header, duplicate/partial dump | validate magic/size, try another dump point, preserve provenance |

## Documentation site

| Symptom | Likely cause | Next steps |
|---|---|---|
| `docusaurus build` reports a broken link | renamed document/heading or incorrect relative path | fix the source link; do not relax `onBrokenLinks` |
| docs load locally but assets 404 after deploy | incorrect `DOCS_BASE_URL` | build with `/<repo>/docs/` and keep a trailing slash |
| project URL shows duplicated `/docs/docs/` | docs plugin and site both use `docs` route | keep Docusaurus `baseUrl` ending in `/docs/` and `routeBasePath: '/'` |
| Jekyll publishes source folders | missing `_config.yml` exclusion | keep `docs`, `references`, and `SKILL.md` in `exclude` |
| local combined site has wrong paths | stale `_site` or non-empty project base URL | run `./scripts/build-site.sh` with empty `SITE_BASEURL` and serve `_site` |
| search is missing in dev mode | local search index is produced at build time | run a production build and `npm run serve --prefix docs` |

## Capture a useful issue report

Include:

```text
Target format and SHA-256 (if it can be shared safely):
Host OS/architecture:
Tool and exact version:
Command:
Complete error text:
Expected result:
Minimal structural details (DEX count, ABI, framework clues):
What changed between working and failing runs:
```

Do not attach proprietary packages, keys, credentials, mappings, or memory dumps to a public issue.
