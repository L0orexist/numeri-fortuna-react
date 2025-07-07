
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setup Tauri per Windows...');

// Funzione per eseguire comandi
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completato!`);
  } catch (error) {
    console.error(`❌ Errore durante: ${description}`);
    console.error(error.message);
    return false;
  }
  return true;
}

// Verifica se Rust è installato
function checkRust() {
  try {
    execSync('rustc --version', { stdio: 'pipe' });
    console.log('✅ Rust è già installato');
    return true;
  } catch (error) {
    console.log('❌ Rust non trovato');
    return false;
  }
}

// Installa Rust se necessario
if (!checkRust()) {
  console.log('\n🦀 Installazione di Rust...');
  console.log('Verrà aperta una finestra del browser per scaricare Rust.');
  console.log('Segui le istruzioni su: https://rustup.rs/');
  console.log('Dopo aver installato Rust, riavvia il terminale e riprova.');
  
  // Apri il browser per il download di Rust
  const { spawn } = require('child_process');
  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', 'https://rustup.rs/']);
  }
  
  process.exit(1);
}

// Installa le dipendenze Tauri
runCommand('npm install', 'Installazione dipendenze NPM');

console.log('\n🎉 Setup completato!');
console.log('\n📝 Comandi disponibili:');
console.log('- npm run tauri:dev   → Sviluppo con hot reload');
console.log('- npm run tauri:build → Creazione eseguibile');
console.log('- node build-tauri.js → Build semplificato');
