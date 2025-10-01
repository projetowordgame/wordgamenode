import { IsString, IsArray, ValidateNested, IsInt, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateSequenceCardDto {
  @IsUrl()
  image_url: string;

  @IsString()
  description: string;

  @IsInt()
  position: number;
}

export class CreateSequenceGameDto {
  @IsString()
  title: string;

  @IsString()
  introduction_text: string;

  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSequenceCardDto)
  cards: CreateSequenceCardDto[];
}
