import { PrismaClient, NodeType, NodeShape } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Ensure DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  // Try to load from .env file
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/DATABASE_URL="(.+)"/);
    if (match) {
      process.env.DATABASE_URL = match[1];
    }
  }
}

// Initialize Prisma with adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Map frontend shape strings to backend enum values
function mapShapeToEnum(shape: string): NodeShape {
  const shapeMap: Record<string, NodeShape> = {
    'circle': NodeShape.CIRCLE,
    'oppositeD': NodeShape.OPPOSITE_D,
    'roundedRectangle': NodeShape.ROUNDED_RECTANGLE,
    'rectangleWithText': NodeShape.RECTANGLE_WITH_TEXT,
  };
  return shapeMap[shape] || NodeShape.CIRCLE;
}

// Map frontend node type to backend enum
function mapNodeTypeToEnum(type: string): NodeType {
  const typeMap: Record<string, NodeType> = {
    'TRIGGER': NodeType.TRIGGER,
    'CODE': NodeType.CODE,
    'CONDITION': NodeType.CONDITION,
    'OTHER': NodeType.OTHER,
  };
  return typeMap[type] || NodeType.OTHER;
}

async function seedNodeTemplates() {
  console.log('🌱 Seeding node templates...');

  // Path to frontend node-config directory
  const templatesDir = path.join(__dirname, '../../web/src/node-config');

  if (!fs.existsSync(templatesDir)) {
    console.error(`❌ Templates directory not found: ${templatesDir}`);
    console.log('💡 Make sure the frontend is in the correct location');
    return;
  }

  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));

  console.log(`📁 Found ${files.length} template files`);

  for (const file of files) {
    try {
      const filePath = path.join(templatesDir, file);
      const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      await prisma.nodeTemplate.upsert({
        where: {
          templateId_version: {
            templateId: config.nodeId,
            version: '1.0.0',
          },
        },
        create: {
          templateId: config.nodeId,
          version: '1.0.0',
          name: config.name,
          description: config.description || null,
          nodeType: mapNodeTypeToEnum(config.nodeType),
          shape: mapShapeToEnum(config.shape),
          handlesConfig: config.handles || [],
          actionConfig: config.action || null,
          dynamicHandles: config.dynamicHandles || null,
          isActive: true,
        },
        update: {
          name: config.name,
          description: config.description || null,
          nodeType: mapNodeTypeToEnum(config.nodeType),
          shape: mapShapeToEnum(config.shape),
          handlesConfig: config.handles || [],
          actionConfig: config.action || null,
          dynamicHandles: config.dynamicHandles || null,
          isActive: true,
        },
      });

      console.log(`  ✅ Seeded template: ${config.nodeId} (${config.name})`);
    } catch (error) {
      console.error(`  ❌ Failed to seed ${file}:`, error.message);
    }
  }

  const count = await prisma.nodeTemplate.count();
  console.log(`\n✨ Successfully seeded ${count} node templates`);
}

async function main() {
  try {
    await seedNodeTemplates();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
