const path = require('path');
const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

async function getEmscripten(version) {
  const emsdk_zip = await tc.downloadTool("https://github.com/emscripten-core/emsdk/archive/master.zip");
  const extPath = await tc.extractZip(emsdk_zip);
  const toolRoot = path.join(extPath, 'emsdk-master');
  const emsdk_bin = path.join(toolRoot, 'emsdk');

  await exec.exec(emsdk_bin, ["install", version]);
  return await tc.cacheDir(toolRoot, "emscripten", version);
}

async function run(version) {
  const toolRoot = tc.find("emscripten", version) || await getEmscripten(version);
  const emsdk_bin = path.join(toolRoot, 'emsdk');

  await exec.exec(emsdk_bin, ["activate", version]);
  let env_stdout = "";
  await exec.exec(path.join(toolRoot, 'emsdk_env.sh'), [], {
    listeners: {
      stdout: data => env_stdout += data.toString()
    }
  });
  env_stdout.match(/(?<=(PATH \+= )).*/g).forEach(p => core.addPath(p))
  env_stdout.match(/\w+ = .*/g).forEach(line => {
    let [varName, varVal] = line.split(" = ");
    core.exportVariable(varName, varVal);
  })
}

try {
  const version = core.getInput('emscripten-version') || 'latest';
  console.log(`Installing emscripten (${version})...`);
  run(version).catch(e => core.setFailed(e));
} catch (error) {
  core.setFailed(error.message);
}
