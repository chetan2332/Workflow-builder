const { PrismaClient } = require('./generated/prisma/browser.js');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Initialize Prisma with adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Map frontend shape strings to backend enum values
function mapShapeToEnum(shape) {
  const shapeMap = {
    'circle': 'CIRCLE',
    'oppositeD': 'OPPOSITE_D',
    'roundedRectangle': 'ROUNDED_RECTANGLE',
    'rectangleWithText': 'RECTANGLE_WITH_TEXT',
  };
  return shapeMap[shape] || 'CIRCLE';
}

// Map frontend node type to backend enum
function mapNodeTypeToEnum(type) {
  const typeMap = {
    'TRIGGER': 'TRIGGER',
    'CODE': 'CODE',
    'CONDITION': 'CONDITION',
    'OTHER': 'OTHER',
  };
  return typeMap[type] || 'OTHER';
}

async function seedNodeTemplates() {
  console.log('🌱 Seeding node templates...');

  // Path to frontend node-config directory
  const templatesDir = path.join(__dirname, '../web/src/node-config');

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
    await pool.end();
  });
