const fs = require('fs');
const path = require('path');

// Admin route'larını güncelle
function updateAdminRoutes() {
  const adminDir = path.join(__dirname, '../app/api/admin');
  
  // Recursive olarak tüm .ts dosyalarını bul
  function findTsFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findTsFiles(fullPath));
      } else if (item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  const tsFiles = findTsFiles(adminDir);
  let updatedCount = 0;
  
  for (const filePath of tsFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Import satırını kontrol et ve ekle
    if (!content.includes('import { isAdminSession }')) {
      const importMatch = content.match(/import.*from.*['"]@\/lib\/prisma['"];?/);
      if (importMatch) {
        const newImport = "import { isAdminSession } from '@/lib/security';";
        content = content.replace(importMatch[0], importMatch[0] + '\n' + newImport);
        updated = true;
      }
    }
    
    // Hardcoded email kontrolünü değiştir
    const oldPattern = /if \(!session\?\.user \|\| \(session\.user as \{ email\?: string \}\)\.email !== 'admin@nebulanexus\.com'\)/g;
    const newPattern = "if (!isAdminSession(session))";
    
    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newPattern);
      updated = true;
    }
    
    // Alternatif pattern'ları da kontrol et
    const altPatterns = [
      /if \(!session\?\.user \|\| session\.user\.email !== 'admin@nebulanexus\.com'\)/g,
      /if \(!session\?\.user \|\| \(session\.user as any\)\.email !== 'admin@nebulanexus\.com'\)/g
    ];
    
    for (const pattern of altPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, newPattern);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
      updatedCount++;
    }
  }
  
  console.log(`\n🎉 Total files updated: ${updatedCount}`);
}

// Forum route'larını da güncelle
function updateForumRoutes() {
  const forumDir = path.join(__dirname, '../app/api/forum');
  
  function findTsFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findTsFiles(fullPath));
      } else if (item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  const tsFiles = findTsFiles(forumDir);
  let updatedCount = 0;
  
  for (const filePath of tsFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Import satırını kontrol et ve ekle
    if (!content.includes('import { isAdminSession }') && content.includes('admin@nebulanexus.com')) {
      const importMatch = content.match(/import.*from.*['"]@\/lib\/prisma['"];?/);
      if (importMatch) {
        const newImport = "import { isAdminSession } from '@/lib/security';";
        content = content.replace(importMatch[0], importMatch[0] + '\n' + newImport);
        updated = true;
      }
    }
    
    // Hardcoded email kontrolünü değiştir
    const oldPattern = /if \(!session\?\.user \|\| \(session\.user as \{ email\?: string \}\)\.email !== 'admin@nebulanexus\.com'\)/g;
    const newPattern = "if (!isAdminSession(session))";
    
    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newPattern);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
      updatedCount++;
    }
  }
  
  console.log(`\n🎉 Total forum files updated: ${updatedCount}`);
}

console.log('🔧 Fixing hardcoded admin email in all routes...\n');

updateAdminRoutes();
updateForumRoutes();

console.log('\n✅ All admin routes have been updated to use environment variable!');
console.log('📝 Don\'t forget to set ADMIN_EMAIL in your .env file'); 