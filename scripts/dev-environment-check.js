/**
 * Furnix Developer Environment Diagnostic Tool
 * Run with: node scripts/dev-environment-check.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const REQUIRED_FILES = [
    'index.html',
    'furniture.html',
    'cart.html',
    'wishlist.html',
    'search.html',
    'login.html',
    'signup.html',
    'account.html',
    'style.css',
    'app.js',
    'server.js',
    'package.json',
    'ARCHITECTURE.md',
    'CONTRIBUTING.md',
    'README.md',
    'docs/DEPLOYMENT.md',
    'docs/STOREFRONT_ARCHITECTURE.md',
    'docs/CLIENT_API_REFERENCE.md'
];

console.log('🔍 Starting Furnix Environment Diagnostic Check...\n');

let missingCount = 0;

REQUIRED_FILES.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
        console.log(`  [OK] Found: ${relPath}`);
    } else {
        console.log(`  [FAIL] Missing file: ${relPath}`);
        missingCount++;
    }
});

console.log('\n----------------------------------------');
if (missingCount === 0) {
    console.log('✅ Environment Diagnostic PASSED: All core documentation & application files exist!');
} else {
    console.log(`❌ Diagnostic FAILED: ${missingCount} required file(s) missing.`);
    process.exit(1);
}
