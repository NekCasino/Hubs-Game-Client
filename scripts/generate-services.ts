import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Путь к сгенерированным TypeScript файлам
const TYPES_DIR = path.resolve(__dirname, '../src/types');
// Путь, куда будем сохранять сгенерированные сервисы
const SERVICES_DIR = path.resolve(__dirname, '../src/services');

/**
 * Получает имя константы сервиса из файла
 */
function getServiceConstantName(content: string, serviceName: string): string {
  // Поиск константы имени сервиса
  const constantRegex = new RegExp(`export const ([A-Z_]+) = "${serviceName}"`);
  const match = content.match(constantRegex);
  return match ? match[1] : `${serviceName.toUpperCase()}_SERVICE_NAME`;
}

/**
 * Извлекает все типы из содержимого файла
 */
function extractTypes(content: string): string[] {
  const typeRegex = /export (interface|enum|type) (\w+)/g;
  const types: string[] = [];
  const uniqueTypes = new Set<string>();
  let match;
  
  while ((match = typeRegex.exec(content)) !== null) {
    const typeName = match[2];
    if (!uniqueTypes.has(typeName)) {
      uniqueTypes.add(typeName);
      types.push(typeName);
    }
  }
  
  return types;
}

/**
 * Генерирует service-класс для gRPC клиента
 */
async function generateServiceClass(protoFile: string) {
  // Чтение файла с интерфейсами
  const content = fs.readFileSync(protoFile, 'utf-8');
  
  // Извлечение имени сервиса и названия файла
  const fileName = path.basename(protoFile);
  const baseFileName = fileName.replace('.service.ts', '').replace('.types.ts', '');
  
  // Поиск интерфейса *ServiceClient
  const clientInterfaceMatch = content.match(/export interface (\w+Client)/);
  if (!clientInterfaceMatch) return;
  
  const clientInterface = clientInterfaceMatch[1];
  const serviceName = clientInterface.replace('Client', '');
  
  // Получаем имя константы сервиса
  const serviceConstant = getServiceConstantName(content, serviceName);
  
  // Извлекаем все типы
  const allTypes = extractTypes(content).filter(t => t !== clientInterface);
  
  // Поиск методов клиента
  const clientMethods: string[] = [];
  const methodRegex = /(\w+)\(request: (\w+), metadata: Metadata, \.\.\.rest: any\): Observable<(\w+)>/g;
  let match;
  
  while ((match = methodRegex.exec(content)) !== null) {
    clientMethods.push(`
  /**
   * ${match[1]} - метод для вызова gRPC ${match[1]}
   * @param request - параметры запроса типа ${match[2]}
   * @param metadata - gRPC metadata (необязательно)
   * @returns Promise с результатом типа ${match[3]}
   */
  async ${match[1]}(request: ${match[2]}, metadata?: Metadata): Promise<${match[3]}> {
    const grpcMetadata = metadata || new Metadata();
    return firstValueFrom(this.service.${match[1]}(request, grpcMetadata));
  }`);
  }
  
  // Если методы не найдены, пропускаем файл
  if (clientMethods.length === 0) return;
  
  // Определяем имя импорта для типов
  const importFileName = `${baseFileName}.types`;
  
  // Создание шаблона service-класса
  const serviceClassTemplate = `import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { 
  ${clientInterface},
  ${serviceConstant},
  ${allTypes.join(',\n  ')}
} from '../types/${importFileName}';

/**
 * Сгенерированный сервис-клиент для ${serviceName}
 */
@Injectable()
export class ${serviceName}ClientService implements OnModuleInit {
  private service!: ${clientInterface};

  constructor(
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<${clientInterface}>(${serviceConstant});
  }
${clientMethods.join('\n')}
}
`;

  // Создание директории, если не существует
  if (!fs.existsSync(SERVICES_DIR)) {
    fs.mkdirSync(SERVICES_DIR, { recursive: true });
  }

  // Запись файла
  const outputFile = path.join(SERVICES_DIR, `${baseFileName}.service.ts`);
  fs.writeFileSync(outputFile, serviceClassTemplate);
  console.log(`✅ Generated service: ${outputFile}`);
}

/**
 * Создает index.ts файл для экспорта всех сервисов
 */
function generateServicesIndex(serviceFiles: string[]) {
  const imports: string[] = [];
  const exports: string[] = [];
  
  serviceFiles.forEach(file => {
    const fileName = path.basename(file, '.ts');
    const matches = fileName.match(/(.+)\.service$/);
    if (!matches) return;
    
    const baseFileName = matches[1];
    
    // Определяем имя сервиса из названия файла
    const serviceName = baseFileName.split('.')[0];
    const serviceClass = `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}ServiceClientService`;
    
    // Читаем файл сервиса для получения правильного имени класса
    const serviceContent = fs.readFileSync(file, 'utf-8');
    const classNameMatch = serviceContent.match(/export class (\w+ClientService)/);
    const className = classNameMatch ? classNameMatch[1] : serviceClass;
    
    imports.push(`import { ${className} } from './${fileName}';`);
    exports.push(`  ${className},`);
  });
  
  const indexContent = `${imports.join('\n')}

export {
${exports.join('\n')}
};
`;
  
  fs.writeFileSync(path.join(SERVICES_DIR, 'index.ts'), indexContent);
  console.log('✅ Generated services index.ts');
}

async function main() {
  console.log('🔍 Searching for generated service files...');
  
  // Получение всех сгенерированных файлов (.types.ts)
  const files = glob.sync(`${TYPES_DIR}/**/*.types.ts`);
  
  // Фильтрация файлов, содержащих сервисы
  const serviceFiles = files.filter(file => {
    const content = fs.readFileSync(file, 'utf-8');
    return content.includes('ServiceClient') && !file.includes('google/protobuf');
  });
  
  console.log(`🔍 Found ${serviceFiles.length} service files`);
  
  // Генерация сервисов
  for (const file of serviceFiles) {
    await generateServiceClass(file);
  }
  
  // Получение списка сгенерированных файлов
  const generatedServices = glob.sync(`${SERVICES_DIR}/**/*.service.ts`);
  
  // Генерация индексного файла
  generateServicesIndex(generatedServices);
  
  console.log('✅ Service generation completed!');
}

main().catch(err => {
  console.error('❌ Error generating services:', err);
  process.exit(1);
}); 