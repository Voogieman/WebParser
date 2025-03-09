import { Controller, Get, Query } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserDto } from "./parser.dto";

@Controller('parser')
export class ParserController {
    constructor(private readonly parserService: ParserService) {}

    @Get('parseWithPuppeteer')
    async parse(@Query() query: ParserDto): Promise<string> {
        try {
            await this.parserService.parseProductPage(query.url, query.region);
            return 'Парсинг завершен. Проверьте screenshot.jpg и product.txt.';
        } catch (error: unknown) {
            if (error instanceof Error) {
                return `Ошибка при парсинге: ${error.message}`;
            }
            return 'Произошла неизвестная ошибка при парсинге.';
        }
    }

    @Get('parseWithApi')
    async parseApi(): Promise<void> {
        return await this.parserService.parseCategory();
    }
}
