import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';
import { SurveyQuestion } from './entities/survey-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyQuestion])],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService]
})
export class SurveysModule {}
