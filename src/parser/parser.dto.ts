import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class ParserDto {
    @IsUrl()
    @IsNotEmpty()
    url!: string;

    @IsString()
    @IsNotEmpty()
    region!: string;
}
