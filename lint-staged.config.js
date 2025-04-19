module.exports = {
  '*.{ts,tsx}': [() => 'tsc -p tsconfig.json --skipLibCheck --noEmit'],
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
