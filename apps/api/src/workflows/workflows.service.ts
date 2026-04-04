import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {

    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.workflow.findMany({
            orderBy: {createdAt: 'desc'}
        });
    }

    findOne(id: string) {
        return this.prisma.workflow.findUnique({
            where: { id },
            include: {
                nodes: true,
                edges: true
            }
        });
    }

    create(dto: CreateWorkflowDto) {
        return this.prisma.workflow.create({
            data: {
                name: dto.name,
                description: dto.description
            }
        });
    }

    update(dto: UpdateWorkflowDto) {
        return this.prisma.workflow.update({
            where: { id: dto.id },
            data: dto
        });
    }

    delete(id: string) {
        return this.prisma.workflow.delete({
            where: { id }
        });
    }
}
