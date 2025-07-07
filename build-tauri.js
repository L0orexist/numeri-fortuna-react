
const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🔨 Building Lotteria con Tauri...');

// Verifica se Rust è installato
function checkRust() {
  try {
    execSync('rustc --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Verifica se le dipendenze sono installate
function checkDependencies() {
  return fs.existsSync('node_modules') && fs.existsSync('src-tauri/Cargo.toml');
}

if (!checkRust()) {
  console.error('❌ Rust non è installato!');
  console.log('Esegui: node setup-tauri.js per installare tutto');
  process.exit(1);
}

if (!checkDependencies()) {
  console.error('❌ Dipendenze mancanti!');
  console.log('Esegui: npm install');
  process.exit(1);
}

console.log('✅ Prerequisiti verificati');

try {
  console.log('📦 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('🦀 Building Tauri app...');
  execSync('npx tauri build', { stdio: 'inherit' });
  
  console.log('\n🎉 Build completato con successo!');
  console.log('📁 Eseguibile creato in: src-tauri/target/release/');
  
} catch (error) {
  console.error('❌ Build fallito:', error.message);
  console.log('\n🔧 Soluzioni possibili:');
  console.log('1. Verifica che Rust sia installato: rustc --version');
  console.log('2. Installa le dipendenze: npm install');
  console.log('3. Esegui setup: node setup-tauri.js');
  process.exit(1);
}
