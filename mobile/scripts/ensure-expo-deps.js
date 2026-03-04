#!/usr/bin/env node
const { execSync } = require('node:child_process');

const REQUIRED = [
  { name: 'expo-asset', version: '~11.0.1' },
];

function hasPackage(pkg) {
  try {
    require.resolve(`${pkg}/package.json`, { paths: [process.cwd()] });
    return true;
  } catch {
    return false;
  }
}

function ensure() {
  const missing = REQUIRED.filter((dep) => !hasPackage(dep.name));

  if (missing.length === 0) {
    console.log('[doctor] Expo required packages are installed.');
    return;
  }

  const installArgs = missing.map((dep) => `${dep.name}@${dep.version}`).join(' ');
  console.log(`[doctor] Missing packages detected: ${missing.map((d) => d.name).join(', ')}`);
  console.log(`[doctor] Installing missing packages: npm install ${installArgs}`);

  try {
    execSync(`npm install ${installArgs}`, { stdio: 'inherit' });
    console.log('[doctor] Installation completed.');
  } catch (error) {
    console.error('[doctor] Failed to install required Expo packages automatically.');
    console.error('[doctor] Please run:');
    console.error(`  npm install ${installArgs}`);
    process.exit(1);
  }
}

ensure();
