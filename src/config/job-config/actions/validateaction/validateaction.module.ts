import { forwardRef, Module } from "@nestjs/common";
import {
  ValidateCreateJobActionCreator,
  ValidateJobActionCreator,
} from "./validateaction.service";
import { DatasetsModule } from "src/datasets/datasets.module";

@Module({
  imports: [forwardRef(() => DatasetsModule)],
  providers: [ValidateJobActionCreator, ValidateCreateJobActionCreator],
  exports: [ValidateJobActionCreator, ValidateCreateJobActionCreator],
})
export class ValidateJobActionModule {}
