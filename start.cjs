
const { exec } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 8080;

console.log('🚀 Starting Visits Dashboard...');
console.log(`📊 Port: ${PORT}`);

// Verificar variáveis de ambiente importantes
const requiredEnvVars = [
  'VITE_GOOGLE_SHEETS_API_KEY',
  'VITE_GOOGLE_SHEETS_SPREADSHEET_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Variáveis de ambiente faltando:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('🔧 Configure essas variáveis no EasyPanel para conectar com Google Sheets');
} else {
  console.log('✅ Variáveis de ambiente do Google Sheets configuradas');
}

if (process.env.VITE_CHATBOT_WEBHOOK_URL) {
  console.log('🤖 Assistente inteligente habilitado (N8N)');
} else {
  console.log('💭 Assistente funcionará em modo local (configure VITE_CHATBOT_WEBHOOK_URL para N8N)');
}

// Build the project
console.log('🔨 Building project...');
exec('npm run build', (buildError, buildStdout, buildStderr) => {
  if (buildError) {
    console.error('❌ Build failed:', buildError);
    process.exit(1);
  }
  
  console.log('✅ Build completed successfully');
  
  // Serve the built files
  console.log('🌐 Starting server...');
  exec(`npx serve -s dist -l ${PORT}`, (serveError, serveStdout, serveStderr) => {
    if (serveError) {
      console.error('❌ Server failed to start:', serveError);
      process.exit(1);
    }
    
    console.log(`✅ Dashboard running on port ${PORT}`);
    console.log(`🔗 Access: http://localhost:${PORT}`);
  });
});
