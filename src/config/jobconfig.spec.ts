import { loadJobConfig, getRegisteredCreateActions} from "./jobconfig";
import { LogJobAction } from "./actions/logaction";
import { registerDefaultActions } from "./configuration";

describe("Job configuration", () => {
    // TODO should be done automatically on init?
    registerDefaultActions();

    it("LogJobAction should be registered", async () => {
        const actions = getRegisteredCreateActions();
        expect("log" in actions); 
    });
    it("Should be able to load from json", async () => {
        const path = "test/config/jobconfig.json";
        const config = await loadJobConfig(path);
        expect(config).toBeDefined();
        expect(config.length).toBe(1);
        expect(config[0].jobType).toBe("archive");
        expect(config[0].create.length).toBe(1);
        var create = config[0].create[0];
        expect(create instanceof LogJobAction);
        expect(create.constructor.actionType).toBe("log");
        create.validate({"config":null});
    });
  });
