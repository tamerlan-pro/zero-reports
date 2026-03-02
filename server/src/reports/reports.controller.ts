import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published reports' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':token')
  @ApiOperation({ summary: 'Get report by access token' })
  @ApiParam({ name: 'token', description: 'Unique report access token' })
  findByToken(@Param('token') token: string) {
    return this.reportsService.findByToken(token);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  create(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }

  @Put(':slug')
  @ApiOperation({ summary: 'Update report by slug' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  update(@Param('slug') slug: string, @Body() dto: UpdateReportDto) {
    return this.reportsService.update(slug, dto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete report by slug' })
  @ApiParam({ name: 'slug', description: 'Report slug' })
  remove(@Param('slug') slug: string) {
    return this.reportsService.remove(slug);
  }
}
