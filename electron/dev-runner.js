
const { spawn } = require('child_process');
const path = require('path');

// Avvia il server di sviluppo Vite
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Aspetta che il server sia pronto prima di avviare Electron
setTimeout(() => {
  const electronProcess = spawn('electron', [path.join(__dirname, 'main.js')], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electronProcess.on('close', () => {
    viteProcess.kill();
    process.exit();
  });
}, 3000);

viteProcess.on('close', () => {
  process.exit();
});
