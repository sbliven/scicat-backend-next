import { Logger } from "@nestjs/common";
import { JobAction, JobDto } from "../../jobconfig.interface";
import { JobClass } from "../../../../jobs/schemas/job.schema";
import {
  actionType,
  RabbitMQJobActionOptions,
} from "./rabbitmqaction.interface";
import { RabbitMQService } from "src/common/rabbitmq/rabbitmq.service";

/**
 * Publish a message in a RabbitMQ queue
 */
export class RabbitMQJobAction<T extends JobDto> implements JobAction<T> {
  private queue: string;
  private exchange: string;
  private key: string;

  getActionType(): string {
    return actionType;
  }

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    options: RabbitMQJobActionOptions,
  ) {
    Logger.log(
      "Initializing RabbitMQJobAction. Params: " + JSON.stringify(options),
      "RabbitMQJobAction",
    );
    this.queue = options.queue;
    this.exchange = options.exchange;
    this.key = options.key;
  }

  async performJob(job: JobClass) {
    Logger.log(
      "Performing RabbitMQJobAction: " + JSON.stringify(job),
      "RabbitMQJobAction",
    );
    this.rabbitMQService.connect(this.queue, this.exchange, this.key);
    this.rabbitMQService.sendMessage(this.queue, JSON.stringify(job));
  }
}
