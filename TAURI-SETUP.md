
# 🎲 Lotteria - Setup Tauri

## 📋 Prerequisiti

### Windows
1. **Installa Rust:**
   ```bash
   # Scarica e installa da: https://rustup.rs/
   # Oppure esegui:
   node setup-tauri.js
   ```

2. **Installa Microsoft C++ Build Tools:**
   - Scarica Visual Studio Installer
   - Installa "C++ build tools" o Visual Studio Community
   - Assicurati che sia incluso "Windows 10/11 SDK"

3. **Installa WebView2 (se non presente):**
   - Solitamente già presente in Windows 10/11
   - Altrimenti scarica da Microsoft

## 🚀 Comandi

### Setup iniziale
```bash
# Installa dipendenze e configura tutto
npm run setup
```

### Sviluppo
```bash
# Avvia in modalità sviluppo con hot reload
npm run tauri:dev
```

### Build per produzione
```bash
# Crea eseguibile
npm run tauri:build

# Oppure usa lo script semplificato
node build-tauri.js
```

## 📁 Output

L'eseguibile verrà creato in:
- Windows: `src-tauri/target/release/lotteria.exe`
- Installer: `src-tauri/target/release/bundle/`

## 🔧 Risoluzione problemi

### Errore "could not determine executable to run"
```bash
# Installa Tauri CLI globalmente
npm install -g @tauri-apps/cli

# Oppure usa npx
npx tauri --version
```

### Errore Rust non trovato
```bash
# Verifica installazione Rust
rustc --version
cargo --version

# Se non funziona, riavvia il terminale dopo aver installato Rust
```

### Errore build C++
- Assicurati di aver installato Visual Studio Build Tools
- Riavvia il terminale dopo l'installazione

## 📦 Dipendenze installate
- `@tauri-apps/cli` - CLI per build e sviluppo
- `@tauri-apps/api` - API per integrazioni native
- Rust toolchain - Necessario per il backend
