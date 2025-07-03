import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Путь к сгенерированным TypeScript файлам
const TYPES_DIR = path.resolve(__dirname, '../src/types');

/**
 * Конвертирует сгенерированные .service.ts файлы в .types.ts и удаляет оригиналы
 */
async function renameGeneratedFiles() {
  console.log('🔍 Поиск сгенерированных файлов...');
  
  // Получение всех сгенерированных файлов
  const files = glob.sync(`${TYPES_DIR}/**/*.service.ts`);
  console.log(`🔍 Найдено ${files.length} файлов`);
  
  for (const file of files) {
    const dirName = path.dirname(file);
    const baseName = path.basename(file, '.service.ts');
    const newName = path.join(dirName, `${baseName}.types.ts`);
    
    // Копируем содержимое в новый файл
    let content = fs.readFileSync(file, 'utf-8');
    
    // Получаем все сгенерированные файлы в том же каталоге
    const siblingFiles = glob.sync(`${dirName}/*.service.ts`);
    
    // Заменяем импорты из других .service.ts файлов на импорты из .types.ts
    for (const siblingFile of siblingFiles) {
      const siblingBaseName = path.basename(siblingFile, '.service.ts');
      if (siblingBaseName !== baseName) {
        const regex = new RegExp(`from ['"]\\.\\/${siblingBaseName}.service['"]`, 'g');
        content = content.replace(regex, `from './${siblingBaseName}.types'`);
      }
    }
    
    // Записываем модифицированное содержимое в новый файл
    fs.writeFileSync(newName, content);
    console.log(`✅ Создан файл ${newName}`);
    
    // Удаляем оригинальный файл .service.ts
    fs.unlinkSync(file);
    console.log(`🗑️ Удален оригинальный файл ${file}`);
  }
  
  console.log('✅ Конвертация файлов завершена');
}

renameGeneratedFiles().catch(err => {
  console.error('❌ Ошибка при конвертации файлов:', err);
  process.exit(1);
}); 