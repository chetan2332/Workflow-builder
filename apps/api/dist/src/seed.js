"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
if (!process.env.DATABASE_URL) {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/DATABASE_URL="(.+)"/);
        if (match) {
            process.env.DATABASE_URL = match[1];
        }
    }
}
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
function mapShapeToEnum(shape) {
    const shapeMap = {
        'circle': client_1.NodeShape.CIRCLE,
        'oppositeD': client_1.NodeShape.OPPOSITE_D,
        'roundedRectangle': client_1.NodeShape.ROUNDED_RECTANGLE,
        'rectangleWithText': client_1.NodeShape.RECTANGLE_WITH_TEXT,
    };
    return shapeMap[shape] || client_1.NodeShape.CIRCLE;
}
function mapNodeTypeToEnum(type) {
    const typeMap = {
        'TRIGGER': client_1.NodeType.TRIGGER,
        'CODE': client_1.NodeType.CODE,
        'CONDITION': client_1.NodeType.CONDITION,
        'OTHER': client_1.NodeType.OTHER,
    };
    return typeMap[type] || client_1.NodeType.OTHER;
}
async function seedNodeTemplates() {
    console.log('🌱 Seeding node templates...');
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
        }
        catch (error) {
            console.error(`  ❌ Failed to seed ${file}:`, error.message);
        }
    }
    const count = await prisma.nodeTemplate.count();
    console.log(`\n✨ Successfully seeded ${count} node templates`);
}
async function main() {
    try {
        await seedNodeTemplates();
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map