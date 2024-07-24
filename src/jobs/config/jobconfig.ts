/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Job configuration
 *
 * Upon startup, first modules and plugins implementing JobAction should register
 * themselves with the various `register*Action` methods.
 *
 * Calling `configuration()` from configuration.ts causes the JobConfig to be
 * instantiated for each job type (archive, retrieve, etc). The actions for this
 * JobConfig are also instantiated by calling `parse` on the registered action with
 * matching action type. This is passed the JSON configuration object.
 *
 * Upon receiving an API request to create, read, or update a job, all configured
 * actions for that job/action combination are called to first verify the request body
 * and then perform the appropriate action.
 */
import * as fs from "fs";
import { JobClass } from "../schemas/job.schema";
import { CreateJobDto } from "../dto/create-job.dto";
import { StatusUpdateJobDto } from "../dto/status-update-job.dto";
import { JobsConfigSchema } from "../types/jobs-config-schema.enum";
import { AuthOp } from "src/casl/authop.enum";
import { CreateJobAuth, JobsAuth } from "../types/jobs-auth.enum";
import Ajv from "ajv";
import { JobConfigSchema } from "./jobConfig.schema";


/**
 * Encapsulates all responses to a particular job type (eg "archive")
 */
export class JobConfig {
  jobType: string;
  configVersion: string;
  create: JobOperation<CreateJobDto>;
  // read: JobOperation<ReadJobDto>;
  statusUpdate: JobOperation<StatusUpdateJobDto>;

  constructor(
    jobType: string,
    configVersion: string,
    create: JobOperation<CreateJobDto>,
    read = undefined,
    statusUpdate: JobOperation<StatusUpdateJobDto>,
  ) {
    this.jobType = jobType;
    this.configVersion = configVersion;
    this.create = create;
    // this.read = read;
    this.statusUpdate = statusUpdate;
  }

  /**
   * Parse job configuration json by dispatching to currently registered JobActions
   * @param data JSON
   * @returns
   */
  static parse(
    jobData: Record<string, any>,
    configVersion: string
  ): JobConfig {
    const type = jobData[JobsConfigSchema.JobType];
    const create = JobOperation.parse<CreateJobDto>(
      createActions,
      jobData[AuthOp.Create],
    );
    const read = undefined;
    const statusUpdate = JobOperation.parse<StatusUpdateJobDto>(
      statusUpdateActions,
      jobData[AuthOp.StatusUpdate],
    );
    return new JobConfig(type, configVersion, create, read, statusUpdate);
  }
}


/**
 * Encapsulates all information for a particular job operation (eg "create", "statusUpdate")
 */
export class JobOperation<DtoType> {
  auth: JobsAuth | undefined;
  actions: JobAction<DtoType>[];

  constructor(actions: JobAction<DtoType>[] = [], auth: JobsAuth | undefined) {
    this.actions = actions;
    this.auth = auth;
  }

  static parse<DtoType>(
    actionList: Record<string, JobActionClass<DtoType>>,
    data: Record<string, any>,
  ): JobOperation<DtoType> {
    // if Auth is not defined, default to #authenticated
    const auth = data[JobsConfigSchema.Auth]
      ? data[JobsConfigSchema.Auth]
      : CreateJobAuth.Authenticated;
    const actionsData: any[] = data[JobsConfigSchema.Actions]
      ? data[JobsConfigSchema.Actions]
      : [];
    const actions = actionsData.map((json) =>
      parseAction<DtoType>(actionList, json),
    );
    return new JobOperation<DtoType>(actions, auth);
  }
}


/**
 * Given a JSON object configuring a JobConfigAction.
 *
 * This is dispatched to registered constructors (see registerCreateAction) based on
 * the "actionType" field of data. Other parameters are action-specific.
 * @param data JSON configuration data
 * @returns
 */
function parseAction<DtoType>(
  actionList: Record<string, JobActionClass<DtoType>>,
  data: Record<string, any>,
): JobAction<DtoType> {
  if (!(JobsConfigSchema.ActionType in data))
    throw SyntaxError(`No action.actionType in ${JSON.stringify(data)}`);

  const type = data[JobsConfigSchema.ActionType];
  if (!(type in actionList)) {
    throw SyntaxError(`No handler found for actions of type ${type}`);
  }

  const actionClass = actionList[type];
  return new actionClass(data);
}


/**
 * Superclass for all responses to Job changes
 */
export interface JobAction<DtoType> {
  /**
   * Validate the DTO, throwing an HttpException for problems
   */
  validate: (dto: DtoType) => Promise<void>;

  /**
   * Respond to the action
   */
  performJob: (job: JobClass) => Promise<void>;

  /**
   * Return the actionType for this action. This should match the class's
   * static actionType (used for constructing the class from the configuration file)
   */
  getActionType(): string;
}


/**
 * Describes the constructor and static members for JobAction implementations
 */
export interface JobActionClass<DtoType> {
  /**
   * Action type, eg "url". Matched during parsing of the action
   */
  readonly actionType: string;
  new (json: Record<string, any>): JobAction<DtoType>;
}

export type JobCreateAction = JobAction<CreateJobDto>;
// export type JobReadAction = JobAction<ReadJobDto>;
export type JobStatusUpdateAction = JobAction<StatusUpdateJobDto>;


/**
 * Action registration
 */
const createActions: Record<string, JobActionClass<CreateJobDto>> = {};
// const readActions: Record<string, JobActionClass<ReadJobDto>> = {};
const statusUpdateActions: Record<string, JobActionClass<StatusUpdateJobDto>> = {};

/**
 * Registers an action to handle jobs of a particular type
 * @param action
 */
export function registerCreateAction(
  action: JobActionClass<CreateJobDto>
) {
  createActions[action.actionType] = action;
}

export function registerStatusUpdateAction(
  action: JobActionClass<StatusUpdateJobDto>,
) {
  statusUpdateActions[action.actionType] = action;
}

/**
 * List of action types with a registered action
 * @returns
 */
export function getRegisteredCreateActions(): string[] {
  return Object.keys(createActions);
}

export function getRegisteredStatusUpdateActions(): string[] {
  return Object.keys(statusUpdateActions);
}


/**
 * Parsing
 */
let jobConfig: JobConfig[] | null = null; // singleton

/**
 * Load jobconfig.json file.
 * Expects one or more JobConfig configurations (see JobConfig.parse)
 * @param filePath path to json config file
 * @returns
 */
export function loadJobConfig(filePath: string): JobConfig[] {
  if (jobConfig !== null) {
    return jobConfig;
  }

  const json = fs.readFileSync(filePath, "utf8");
  let data = JSON.parse(json);

  // Validate schema
  const ajv = new Ajv();
  const validate = ajv.compile(JobConfigSchema);

  if (validate(data)) {
    console.log("Schema is valid!");
  } else {
    console.log("Invalid Schema", JSON.stringify(validate.errors, null, 2));
  }

  jobConfig = data.jobs.map((jobData: Record<string, any>) => JobConfig.parse(jobData, data.configVersion));
  return jobConfig as JobConfig[];
}