
const { execSync } = require('child_process');

console.log('Building with Tauri...');
try {
  execSync('npx tauri build', { stdio: 'inherit' });
  console.log('Tauri app built successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
}
