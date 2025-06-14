const { exec } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 8080;

console.log('🚀 Starting Visits Dashboard...');
console.log(`📊 Port: ${PORT}`);

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
  });
});
