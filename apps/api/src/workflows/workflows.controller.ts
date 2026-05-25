import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { CurrentUser, type AuthUser } from '../auth/current-user.decorator';

@Controller('workflows')
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) {}

    @Get()
    findAll(
        @CurrentUser() user: AuthUser,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
    ) {
        return this.workflowsService.findAll(user.userId, {
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            status,
        });
    }

    @Get(':id')
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.workflowsService.findOne(id, user.userId);
    }

    @Post()
    create(@CurrentUser() user: AuthUser, @Body() createWorkflowDto: CreateWorkflowDto) {
        return this.workflowsService.create(createWorkflowDto, user.userId);
    }

    @Put(':id')
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
        return this.workflowsService.update(id, updateWorkflowDto, user.userId);
    }

    @Delete(':id')
    delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.workflowsService.delete(id, user.userId);
    }
}
