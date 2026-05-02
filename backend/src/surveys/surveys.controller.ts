import { Controller, Get, Post, Body } from '@nestjs/common';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Get('questions')
  getQuestions() {
    return this.surveysService.findAll();
  }

  @Post('submit')
  submit(@Body() data: any) {
    return this.surveysService.submitResponse(data);
  }
}
