import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { UpdateSampleDto } from "./update-sample.dto";

export class CreateSampleDto extends UpdateSampleDto {
  @ApiProperty({
    type: String,
    required: false,
    description:
      "Globally unique identifier of a sample. This could be provided as an input value or generated by the system.",
  })
  @IsString()
  @IsOptional()
  readonly sampleId?: string;
}
