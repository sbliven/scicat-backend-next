import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { DatasetsService } from "src/datasets/datasets.service";
import { PoliciesController } from "./policies.controller";
import { PoliciesService } from "./policies.service";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory";

class PoliciesServiceMock {}
class DatasetsServiceMock {}
class CaslAbilityFactoryMock {}

describe("PoliciesController", () => {
  let controller: PoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliciesController],
      providers: [
        { provide: PoliciesService, useClass: PoliciesServiceMock },
        { provide: DatasetsService, useClass: DatasetsServiceMock },
        { provide: CaslAbilityFactory, useClass: CaslAbilityFactoryMock },
      ],
    }).compile();

    controller = module.get<PoliciesController>(PoliciesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
