import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AdInsertDto {
  position: number;
  code: string;
  enabled: boolean;
}

export class UpdateAdsConfigDto {
  @IsOptional()
  @IsString()
  adsTxt?: string;

  @IsOptional()
  @IsString()
  headerScript?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdInsertDto)
  adInserts?: AdInsertDto[];
}

