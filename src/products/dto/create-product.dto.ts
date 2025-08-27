import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';
import { number } from 'joi';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => number)
  public price: number;
}
