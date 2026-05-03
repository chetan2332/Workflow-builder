import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/save-workflow.dto';

@Controller('workflows')
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) {}

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
    ) {
        return this.workflowsService.findAll({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            status,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.workflowsService.findOne(id);
    }

    @Post()
    create(@Body() createWorkflowDto: CreateWorkflowDto) {
        return this.workflowsService.create(createWorkflowDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
        return this.workflowsService.update(id, updateWorkflowDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.workflowsService.delete(id);
    }
}
