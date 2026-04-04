import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Controller('workflows')
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) {}

    @Get()
    findAll() {
        return this.workflowsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.workflowsService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateWorkflowDto) {
        return this.workflowsService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
        return this.workflowsService.update(dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.workflowsService.delete(id);
    }
}
