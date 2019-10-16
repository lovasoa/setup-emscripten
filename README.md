# emscripten github action

![CI status](https://github.com/lovasoa/setup-emscripten/workflows/Test%20emscripten%20installation/badge.svg)

This [github action](https://github.com/features/actions) installs
[emscripten](https://emscripten.org/) and adds it to the PATH so that you can use
`emcc`, `emmake`, etc.
in your workflows.

## Inputs

### `emscripten-version`

**optional** The version of emscripten to install. See the [emscripten release notes](https://emscripten.org/docs/introducing_emscripten/release_notes.html) for the list of available versions.

## Example usage

```yaml
uses: lovasoa/setup-emscripten@master
with:
  emscripten-version: '1.38.47'
```
