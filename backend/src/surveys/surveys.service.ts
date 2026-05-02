import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyQuestion, QuestionType } from './entities/survey-question.entity';

@Injectable()
export class SurveysService implements OnModuleInit {
  constructor(
    @InjectRepository(SurveyQuestion)
    private readonly questionRepository: Repository<SurveyQuestion>,
  ) {}

  async onModuleInit() {
    const count = await this.questionRepository.count();
    if (count === 0) {
      await this.seed();
    }
  }

  findAll() {
    return this.questionRepository.find({ order: { order: 'ASC' } });
  }

  async seed() {
    const questions = [
      {
        text: 'Bạn đánh giá thế nào về chất lượng kẹo của chúng tôi?',
        type: QuestionType.RATING,
        required: true,
        order: 1
      },
      {
        text: 'Bạn thích loại hương vị nào nhất?',
        type: QuestionType.RADIO,
        options: ['Trái cây', 'Chocolate', 'Bạc hà', 'Caramel'],
        required: true,
        order: 2
      },
      {
        text: 'Bạn có muốn chúng tôi bổ sung thêm loại kẹo nào không?',
        type: QuestionType.TEXT,
        required: false,
        order: 3
      },
      {
        text: 'Bạn biết đến CandyShop qua kênh nào?',
        type: QuestionType.CHECKBOX,
        options: ['Facebook', 'Instagram', 'Bạn bè giới thiệu', 'Quảng cáo'],
        required: false,
        order: 4
      }
    ];
    await this.questionRepository.save(questions);
  }

  async submitResponse(data: any) {
    // Trong thực tế sẽ lưu vào survey_responses table
    console.log('Survey Response Received:', data);
    return { success: true, message: 'Cảm ơn bạn đã phản hồi!' };
  }
}
