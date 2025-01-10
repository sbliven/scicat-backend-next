/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

var utils = require("./LoginUtils");
const { TestData } = require("./TestData");

let accessTokenAdminIngestor = null,
  accessTokenUser1 = null,
  accessTokenUser3 = null,
  accessTokenUser51 = null,
  accessTokenUser52 = null,
  accessTokenAdmin = null,
  accessTokenArchiveManager = null;

let datasetPid1 = null,
  datasetPid2 = null,
  datasetPid3 = null,
  jobId1 = null,
  encodedJobId1 = null,
  jobId2 = null,
  encodedJobId2 = null,
  jobId3 = null,
  encodedJobId3 = null,
  jobId4 = null,
  encodedJobId4 = null,
  jobId5 = null,
  encodedJobId5 = null,
  jobId6 = null,
  encodedJobId6 = null,

  jobIdGroup1 = null,
  encodedJobIdGroup1 = null,
  jobIdGroup2 = null,
  encodedJobIdGroup2 = null,
  jobIdGroup3 = null,
  encodedJobIdGroup3 = null,
  jobIdGroup4 = null,
  encodedJobIdGroup4 = null,
  jobIdGroup5 = null,
  encodedJobIdGroup5 = null,
  jobIdGroup6 = null,
  encodedJobIdGroup6 = null,

  jobIdUser1 = null,
  encodedJobIdUser1 = null,
  jobIdUser2 = null,
  encodedJobIdUser2 = null,
  jobIdUser3 = null,
  encodedJobIdUser3 = null,
  jobIdUser4 = null,
  encodedJobIdUser4 = null,
  jobIdUser5 = null,
  encodedJobIdUser5 = null,
  jobIdUser6 = null,
  encodedJobIdUser6 = null,

  jobIdUserSpec1 = null,
  encodedJobIdUserSpec1 = null,
  jobIdUserSpec2 = null,
  encodedJobIdUserSpec2 = null,
  jobIdUserSpec3 = null,
  encodedJobIdUserSpec3 = null,
  jobIdUserSpec4 = null,
  encodedJobIdUserSpec4 = null,
  jobIdUserSpec5 = null,
  encodedJobIdUserSpec5 = null,
  jobIdUserSpec6 = null,
  encodedJobIdUserSpec6 = null,
  jobIdUserSpec7 = null,
  encodedJobIdUserSpec7 = null,

  jobIdGroupSpec1 = null,
  encodedJobIdGroupSpec1 = null,
  jobIdGroupSpec2 = null,
  encodedJobIdGroupSpec2 = null,
  jobIdGroupSpec3 = null,
  encodedJobIdGroupSpec3 = null,
  jobIdGroupSpec4 = null,
  encodedJobIdGroupSpec4 = null,
  jobIdGroupSpec5 = null,
  encodedJobIdGroupSpec5 = null,
  jobIdGroupSpec6 = null,
  encodedJobIdGroupSpec6 = null,
  jobIdGroupSpec7 = null,
  encodedJobIdGroupSpec7 = null,
  jobIdGroupSpec8 = null,
  encodedJobIdGroupSpec8 = null,

  jobIdValidate1 = null,
  encodedJobIdValidate1 = null;

const dataset1 = {
  ...TestData.RawCorrect,
  isPublished: true,
  ownerGroup: "group1",
  accessGroups: ["group5"],
};

const dataset2 = {
  ...TestData.RawCorrect,
  isPublished: false,
  ownerGroup: "group2",
  accessGroups: [],
};

const dataset3 = {
  ...TestData.RawCorrect,
  isPublished: false,
  ownerGroup: "group5",
  accessGroups: ["group1"],
};

const jobAll = {
  type: "all_access",
};
const jobDatasetPublic = {
  type: "public_access",
}
const jobAuthenticated = {
  type: "authenticated_access"
};
const jobDatasetAccess = {
  type: "dataset_access"
};
const jobDatasetOwner = {
  type: "owner_access"
};
const jobUser51 = {
  type: "user_access"
};
const jobGroup5 = {
  type: "group_access"
};
const archiveJob = {
  type: "archive"
};
const retrieveJob = {
  type: "retrieve"
};
const publicJob = {
  type: "public"
};
const jobValidate = {
  type: "validate"
};

describe("1100: Jobs: Test New Job Model", () => {
  before(() => {
    db.collection("Dataset").deleteMany({});
    db.collection("Job").deleteMany({});
  });

  beforeEach(async () => {
    accessTokenAdminIngestor = await utils.getToken(appUrl, {
      username: "adminIngestor",
      password: TestData.Accounts["adminIngestor"]["password"],
    });

    accessTokenUser1 = await utils.getToken(appUrl, {
      username: "user1",
      password: TestData.Accounts["user1"]["password"],
    });

    accessTokenUser3 = await utils.getToken(appUrl, {
      username: "user3",
      password: TestData.Accounts["user3"]["password"],
    });

    accessTokenUser51 = await utils.getToken(appUrl, {
      username: "user5.1",
      password: TestData.Accounts["user5.1"]["password"],
    });

    accessTokenUser52 = await utils.getToken(appUrl, {
      username: "user5.2",
      password: TestData.Accounts["user5.2"]["password"],
    });

    accessTokenAdmin = await utils.getToken(appUrl, {
      username: "admin",
      password: TestData.Accounts["admin"]["password"],
    });

    accessTokenArchiveManager = await utils.getToken(appUrl, {
      username: "archiveManager",
      password: TestData.Accounts["archiveManager"]["password"],
    });
  });

  after(() => { // because we're not deleting all the jobs and don't delete datasets
    db.collection("Dataset").deleteMany({});
    db.collection("Job").deleteMany({});
  });

  it("0010: adds dataset 1 as Admin Ingestor", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(dataset1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdminIngestor}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal("group1");
        res.body.should.have.property("type").and.equal("raw");
        res.body.should.have.property("isPublished").and.equal(true);
        res.body.should.have.property("pid").and.be.string;
        datasetPid1 = res.body["pid"];
      });
  });

  it("0020: adds dataset 2 as Admin Ingestor", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(dataset2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdminIngestor}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal("group2");
        res.body.should.have.property("type").and.equal("raw");
        res.body.should.have.property("isPublished").and.equal(false);
        res.body.should.have.property("pid").and.be.string;
        datasetPid2 = res.body["pid"];
      });
  });

  it("0030: adds dataset 3 as Admin Ingestor", async () => {
    return request(appUrl)
      .post("/api/v3/Datasets")
      .send(dataset3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdminIngestor}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("ownerGroup").and.equal("group5");
        res.body.should.have.property("type").and.equal("raw");
        res.body.should.have.property("isPublished").and.equal(false);
        res.body.should.have.property("pid").and.be.string;
        datasetPid3 = res.body["pid"];
      });
  });

  it("0040: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#all' configuration with no datasets in job parameters, which should fail", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id")
        res.body.should.have.property("message").and.be.equal("List of passed datasets is empty.");
      });
  });

  it("0050: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#all' configuration with not existing dataset IDs, which should fail", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: "fakeID", files: [] },
          { pid: "fakeID2", files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id")
        res.body.should.have.property("message").and.be.equal("Datasets with pid fakeID,fakeID2 do not exist.");
      });
  });

  it("0060: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetPublic' configuration with no jobParams parameter, which should fail", async () => {
    const newDataset = {
      type: "all_access",
      ownerUser: "admin",
      ownerGroup: "admin",
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
      });
  });

  it("0065: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetPublic' configuration with empty jobParams parameter", async () => {
    const newDataset = {
      type: "all_access",
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {},
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0070: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobId1 = res.body["id"];
        encodedJobId1 = encodeURIComponent(jobId1);
      });
  });

  it("0080: Add a new job as a user from ADMIN_GROUPS for another user in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobId2 = res.body["id"];
        encodedJobId2 = encodeURIComponent(jobId2);
      });
  });

  it("0090: Add a new job as a user from ADMIN_GROUPS for undefined user from another group user in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobId3 = res.body["id"];
        encodedJobId3 = encodeURIComponent(jobId3);
      });
  });

  it("0100: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobId6 = res.body["id"];
        encodedJobId6 = encodeURIComponent(jobId6);
      });
  });

  it("0110: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0120: Add a new job as a user from CREATE_JOB_GROUPS for his/her group in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0130: Add a new job as a user from CREATE_JOB_GROUPS for another user in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User owning the job should match user logged in.");
      });
  });

  it("0140: Add a new job as a user from CREATE_JOB_GROUPS for another group in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User needs to belong to job owner group.");
      });
  });

  it("0150: Add a new job as a user from CREATE_JOB_GROUPS for anonymous user in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. Owner group should be specified.");
      });
  });

  it("0160: Add a new job as a normal user for himself/herself in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobId4 = res.body["id"];
        encodedJobId4 = encodeURIComponent(jobId4);
      });
  });

  it("0170: Add a new job as a normal user for his/her group in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobId5 = res.body["id"];
        encodedJobId5 = encodeURIComponent(jobId5);
      });
  });

  it("0180: Add a new job as a normal user for another user in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User owning the job should match user logged in.");
      });
  });

  it("0190: Add a new job as a normal user for another group in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User needs to belong to job owner group.");
      });
  });

  it("0200: Add a new job as a normal user for anonymous user in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. Owner group should be specified.");
      });
  });

  it("0210: Adds a new job as unauthenticated user in '#all' configuration", async () => {
    const newDataset = {
      ...jobAll,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerUser");
        res.body.should.not.have.property("ownerGroup");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0220: Adds a new job as unauthenticated user for another user in '#all' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobAll,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. Unauthenticated user cannot initiate a job owned by another user.");
      });
  });

  it("0230: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetPublic' configuration with all published datasets", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0240: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetPublic' configuration with one unpublished dataset", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0250: Add a new job as a user from ADMIN_GROUPS for another user in '#datasetPublic' configuration with one unpublished dataset", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0260: Add a new job as a user from ADMIN_GROUPS for another group in '#datasetPublic' configuration with one unpublished dataset", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0270: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#datasetPublic' configuration with one unpublished dataset", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0280: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#datasetPublic' configuration with all published datasets", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0290: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#datasetPublic' configuration with one unpublished dataset", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0300: Add a new job as a normal user himself/herself in '#datasetPublic' configuration with a published dataset", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0310: Add a new job as a normal user himself/herself in '#datasetPublic' configuration with unpublished datasets, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0311: Add a new public job as a normal user himself/herself with a published dataset", async () => {
    const newDataset = {
      ...publicJob,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0312: Add a new public job as a normal user himself/herself with unpublished datasets, which should fail", async () => {
    const newDataset = {
      ...publicJob,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.ConflictStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("The following datasets are not public.");
      });
  });

  it("0313: Add a new archive job as a normal user himself/herself with an archivable dataset", async () => {
    const newDataset = {
      ...archiveJob,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0314: Add a new retrieve job as a normal user himself/herself with a non retrievable dataset, which should fail", async () => {
    const newDataset = {
      ...retrieveJob,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.ConflictStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("The following datasets are not in retrievable state for a retrieve job.");
      });
  });

  it("0315: Add a new public job as a normal user himself/herself with unknown files, which should fail", async () => {
    const newDataset = {
      ...publicJob,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [ "fakeID" ] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("At least one requested file could not be found.");
      });
  });

  it("0316: Add a new public job as a normal user himself/herself choosing only specific files", async () => {
    const newDataset = {
      ...publicJob,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [ "N1039-1.tif", "N1039-2.tif" ] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0320: Add a new job as anonymous user in '#datasetPublic' configuration with all published datasets", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerUser");
        res.body.should.not.have.property("ownerGroup");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0330: Add a new job as anonymous user in '#datasetPublic' configuration with one unpublished dataset, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobDatasetPublic,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0340: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#authenticated' configuration", async () => {
    const newDataset = {
      ...jobAuthenticated,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0350: Add a new job as a user from ADMIN_GROUPS for another user in '#authenticated' configuration", async () => {
    const newDataset = {
      ...jobAuthenticated,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });
  it("0360: Add a new job as a user from ADMIN_GROUPS for another group in '#authenticated' configuration", async () => {
    const newDataset = {
      ...jobAuthenticated,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0370: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#authenticated' configuration", async () => {
    const newDataset = {
      ...jobAuthenticated,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0380: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#authenticated' configuration", async () => {
    const newDataset = {
      ...jobAuthenticated,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0390: Add a new job as a normal user for himself/herself in '#authenticated' configuration", async () => {
    const newDataset = {
      ...jobAuthenticated,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0400: Add a new job as unauthenticated user in '#authenticated' configuration, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobAuthenticated,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0410: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetAccess' configuration", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroup1 = res.body["id"];
        encodedJobIdGroup1 = encodeURIComponent(jobIdGroup1);
      });
  });

  it("0420: Add a new job as a user from ADMIN_GROUPS for another user in '#datasetAccess' configuration", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroup2 = res.body["id"];
        encodedJobIdGroup2 = encodeURIComponent(jobIdGroup2);
      });
  });

  it("0430: Add a new job as a user from ADMIN_GROUPS for another group in '#datasetAccess' configuration", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroup3 = res.body["id"];
        encodedJobIdGroup3 = encodeURIComponent(jobIdGroup3);
      });
  });

  it("0435: Add a new job as a user from ADMIN_GROUPS for another group in '#datasetAccess' configuration", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroup5 = res.body["id"];
        encodedJobIdGroup5 = encodeURIComponent(jobIdGroup5);
      });
  });

  it("0440: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#datasetAccess' configuration", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroup6 = res.body["id"];
        encodedJobIdGroup6 = encodeURIComponent(jobIdGroup6);
      });
  });

  it("0450: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#datasetAccess' configuration with access to datasets", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0460: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#datasetAccess' configuration with no access to datasets", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0470: Adds a new job as user1 for user5.1 ownerUser and group5 ownerGroup for #datasetAccess, which should fail", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };
    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User owning the job should match user logged in.");
      });
  });

  it("0480: Add a new job as a normal user for himself/herself in '#datasetAccess' configuration with access to datasets", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroup4 = res.body["id"];
        encodedJobIdGroup4 = encodeURIComponent(jobIdGroup4);
      });
  });

  it("0490: Add a new job as a normal user for himself/herself in '#datasetAccess' configuration with no access to datasets, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobDatasetAccess,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0500: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetOwner' configuration", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUser1 = res.body["id"];
        encodedJobIdUser1 = encodeURIComponent(jobIdUser1);
      });
  });

  it("0510: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#datasetOwner' configuration", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0520: Add a new job as a user from ADMIN_GROUPS for another user in '#datasetOwner' configuration", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUser2 = res.body["id"];
        encodedJobIdUser2 = encodeURIComponent(jobIdUser2);
      });
  });

  it("0530: Add a new job as a user from ADMIN_GROUPS for another group in '#datasetOwner' configuration", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUser3 = res.body["id"];
        encodedJobIdUser3 = encodeURIComponent(jobIdUser3);
      });
  });

  it("0535: Add a new job as a user from ADMIN_GROUPS for another group in '#datasetOwner' configuration", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUser5 = res.body["id"];
        encodedJobIdUser5 = encodeURIComponent(jobIdUser5);
      });
  });

  it("0540: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#datasetOwner' configuration", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUser6 = res.body["id"];
        encodedJobIdUser6 = encodeURIComponent(jobIdUser6);
      });
  });

  it("0550: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#datasetOwner' configuration with datasets owned by his/her group", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0560: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself in '#datasetOwner' configuration with datasets owned by his/her group", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0570: Add a new job as a normal user for himself/herself in '#datasetOwner' configuration with datasets owned by his/her group", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid3, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUser4 = res.body["id"];
        encodedJobIdUser4 = encodeURIComponent(jobIdUser4);
      });
  });

  it("0580: Add a new job as a normal user for himself/herself in '#datasetOwner' configuration with datasets not owned by his/her group, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobDatasetOwner,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0590: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec1 = res.body["id"];
        encodedJobIdUserSpec1 = encodeURIComponent(jobIdUserSpec1);
      });
  });

  it("0600: Add a new job as a user from ADMIN_GROUPS for another user in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec2 = res.body["id"];
        encodedJobIdUserSpec2 = encodeURIComponent(jobIdUserSpec2);
      });
  });

  it("0610: Add a new job as a user from ADMIN_GROUPS for another group in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec3 = res.body["id"];
        encodedJobIdUserSpec3 = encodeURIComponent(jobIdUserSpec3);
      });
  });

  it("0615: Add a new job as a user from ADMIN_GROUPS for another group in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec5 = res.body["id"];
        encodedJobIdUserSpec5 = encodeURIComponent(jobIdUserSpec5);
      });
  });

  it("0616: Add a new job as a user from ADMIN_GROUPS for another user in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "user5.2",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.2");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec7 = res.body["id"];
        encodedJobIdUserSpec7 = encodeURIComponent(jobIdUserSpec7);
      });
  });


  it("0620: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec6 = res.body["id"];
        encodedJobIdUserSpec6 = encodeURIComponent(jobIdUserSpec6);
      });
  });

  it("0630: Add a new job as a user from CREATE_JOB_GROUPS for himself/herself user in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0640: Add a new job as a user from CREATE_JOB_GROUPS for user5.1 in '#USER5.1' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User owning the job should match user logged in.");
      });
  });

  it("0650: Adds a new job as user5.1 himself/herself in '#USER5.1' configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdUserSpec4 = res.body["id"];
        encodedJobIdUserSpec4 = encodeURIComponent(jobIdUserSpec4);
      });
  });

  it("0660: Adds a new job as user5.1 for no ownerUser and group5 ownerGroup in #USER5.1 configuration", async () => {
    const newDataset = {
      ...jobUser51,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0670: Adds a new job as user5.2 for himself/herself in #USER5.1, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobUser51,
      ownerUser: "user5.2",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser52}` })
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0680: Add a new job as a user from ADMIN_GROUPS for himself/herself in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "admin",
      ownerGroup: "admin",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("admin");
        res.body.should.have.property("ownerUser").and.be.equal("admin");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec1 = res.body["id"];
        encodedJobIdGroupSpec1 = encodeURIComponent(jobIdGroupSpec1);
      });
  });

  it("0690: Add a new job as a user from ADMIN_GROUPS for another user in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec2 = res.body["id"];
        encodedJobIdGroupSpec2 = encodeURIComponent(jobIdGroupSpec2);
      });
  });

  it("0700: Add a new job as a user from ADMIN_GROUPS for another group in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec3 = res.body["id"];
        encodedJobIdGroupSpec3 = encodeURIComponent(jobIdGroupSpec3);
      });
  });

  it("0705: Add a new job as a user from ADMIN_GROUPS for another group in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec5 = res.body["id"];
        encodedJobIdGroupSpec5 = encodeURIComponent(jobIdGroupSpec5);
      });
  });

  it("0706: Add a new job as a user from ADMIN_GROUPS for another user in '@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user3",
      ownerGroup: "group3",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group3");
        res.body.should.have.property("ownerUser").and.be.equal("user3");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec8 = res.body["id"];
        encodedJobIdGroupSpec8 = encodeURIComponent(jobIdGroupSpec8);
      });
  });

  it("0710: Add a new job as a user from ADMIN_GROUPS for anonymous user in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.not.have.property("ownerGroup");
        res.body.should.not.have.property("ownerUser");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec6 = res.body["id"];
        encodedJobIdGroupSpec6 = encodeURIComponent(jobIdGroupSpec6);
      });
  });

  it("0720: Add a new job as a user from CREATE_JOB_GROUPS for another group in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user1",
      ownerGroup: "group1",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group1");
        res.body.should.have.property("ownerUser").and.be.equal("user1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0730: Add a new job as a user from CREATE_JOB_GROUPS for user 5.1 in '#@group5' configuration, which should fail as bad request", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Invalid new job. User owning the job should match user logged in.");
      });
  });

  it("0740: Add a new job as a user 5.1 for himself/herself in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user5.1",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec4 = res.body["id"];
        encodedJobIdGroupSpec4 = encodeURIComponent(jobIdGroupSpec4);
      });
  });

  it("0750: Add a new job as a user 5.1 for another user in his/her group in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.1");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
      });
  });

  it("0760: Add a new job as a user 5.2 for himself/herself in '#@group5' configuration", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user5.2",
      ownerGroup: "group5",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser52}` })
      .expect(TestData.EntryCreatedStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("type").and.be.string;
        res.body.should.have.property("ownerGroup").and.be.equal("group5");
        res.body.should.have.property("ownerUser").and.be.equal("user5.2");
        res.body.should.have.property("statusCode").to.be.equal("jobCreated");
        jobIdGroupSpec7 = res.body["id"];
        encodedJobIdGroupSpec7 = encodeURIComponent(jobIdGroupSpec7);
      });
  });

  it("0770: Adds a new job as user3 for himself/herself in #@group5 configuration, which should fail as forbidden", async () => {
    const newDataset = {
      ...jobGroup5,
      ownerUser: "user3",
      ownerGroup: "group3",
      jobParams: {
        datasetList: [
          { pid: datasetPid1, files: [] },
          { pid: datasetPid2, files: [] },
        ],
      },
    };

    return request(appUrl)
      .post("/api/v3/Jobs")
      .send(newDataset)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser3}` })
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.not.have.property("id");
        res.body.should.have.property("message").and.be.equal("Unauthorized to create this job.");
      });
  });

  it("0780: Adds a status update to a job as a user from ADMIN_GROUPS for his/her job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId1}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0790: Adds a Status update to a job as a user from ADMIN_GROUPS for another user's job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0800: Adds a Status update to a job as a user from ADMIN_GROUPS for another group's job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0810: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0820: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0830: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0840: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her group in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0850: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's group in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0860: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for anonymous user's group in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0870: Adds a Status update to a job as a normal user  for his/her job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0880: Adds a Status update to a job as a normal user for another user's job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0890: Adds a Status update to a job as a normal user for his/her group in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0900: Adds a Status update to a job as a normal user for another user's group in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0910: Adds a Status update to a job as a normal user for anonymous user's group in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0920: Adds a Status update to a job as unauthhenticated user for anonymous job in '#all' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0930: Adds a Status update to a job as unauthhenticated user for anouther group's job in '#all' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0940: Adds a Status update to a job as unauthhenticated user for another user's job in '#all' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobId2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0950: Adds a status update to a job as a user from ADMIN_GROUPS for his/her job in '#jobOwnerUser' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser1}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("0960: Adds a Status update to a job as a user from ADMIN_GROUPS for another group's job in '#jobOwnerUser' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdUser2}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("0970: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '#jobOwnerUser' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdUser3}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("0980: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '#jobOwnerUser' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
    });

  it("0990: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her job in '#jobOwnerUser' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1000: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's job in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1010: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her group in '#jobOwnerUser' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1020: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's group in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1030: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for anonymous user's group in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1040: Adds a Status update to a job as a normal user  for his/her job in '#jobOwnerUser' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1050: Adds a Status update to a job as a normal user for another user's job in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1060: Adds a Status update to a job as a normal user for his/her group in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1070: Adds a Status update to a job as a normal user for another user's group in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1080: Adds a Status update to a job as a normal user for anonymous user's group in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1090: Adds a Status update to a job as unauthhenticated user for anonymous user's group in '#jobOwnerUser' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1100: Adds a status update to a job as a user from ADMIN_GROUPS for his/her job in '#jobOwnerGroup' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup1}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1110: Adds a Status update to a job as a user from ADMIN_GROUPS for another group's job in '#jobOwnerGroup' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdGroup2}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1120: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '#jobOwnerGroup' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdGroup3}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1130: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '#jobOwnerGroup' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
    });


    it("1140: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her job in '#jobOwnerGroup' configuration", async () => {
      return request(appUrl)
          .patch(`/api/v3/Jobs/${encodedJobIdGroup2}`)
          .send({
            statusMessage: "update status of a job",
            statusCode: "job finished/blocked/etc",
          })
          .set("Accept", "application/json")
          .set({ Authorization: `Bearer ${accessTokenUser1}` })
          .expect(TestData.SuccessfulPatchStatusCode)
          .expect("Content-Type", /json/);
    });
    it("1150: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's job in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
      return request(appUrl)
          .patch(`/api/v3/Jobs/${encodedJobIdGroup4}`)
          .send({
            statusMessage: "update status of a job",
            statusCode: "job finished/blocked/etc",
          })
          .set("Accept", "application/json")
          .set({ Authorization: `Bearer ${accessTokenUser1}` })
          .expect(TestData.AccessForbiddenStatusCode)
          .expect("Content-Type", /json/);
    });
    it("1160: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her group in '#jobOwnerGroup' configuration", async () => {
      return request(appUrl)
          .patch(`/api/v3/Jobs/${encodedJobIdGroup3}`)
          .send({
            statusMessage: "update status of a job",
            statusCode: "job finished/blocked/etc",
          })
          .set("Accept", "application/json")
          .set({ Authorization: `Bearer ${accessTokenUser1}` })
          .expect(TestData.SuccessfulPatchStatusCode)
          .expect("Content-Type", /json/);
    });
    it("1170: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's group in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
      return request(appUrl)
          .patch(`/api/v3/Jobs/${encodedJobIdGroup5}`)
          .send({
            statusMessage: "update status of a job",
            statusCode: "job finished/blocked/etc",
          })
          .set("Accept", "application/json")
          .set({ Authorization: `Bearer ${accessTokenUser1}` })
          .expect(TestData.AccessForbiddenStatusCode)
          .expect("Content-Type", /json/);
    });

    it("1180: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for anonymous user's group in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
      return request(appUrl)
          .patch(`/api/v3/Jobs/${encodedJobIdGroup6}`)
          .send({
            statusMessage: "update status of a job",
            statusCode: "job finished/blocked/etc",
          })
          .set("Accept", "application/json")
          .set({ Authorization: `Bearer ${accessTokenUser1}` })
          .expect(TestData.AccessForbiddenStatusCode)
          .expect("Content-Type", /json/);
    });

  it("1190: Adds a Status update to a job as a normal user  for his/her job in '#jobOwnerGroup' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1200: Adds a Status update to a job as a normal user for another user's job in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1210: Adds a Status update to a job as a normal user for his/her group in '#jobOwnerGroup' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1220: Adds a Status update to a job as a normal user for another user's group in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1230: Adds a Status update to a job as a normal user for anonymous user's group in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1240: Adds a Status update to a job as unauthhenticated user for anonymous user's group in '#jobOwnerGroup' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroup6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1250: Adds a Status update to a job as a user from ADMIN_GROUPS for his/her job in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec1}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1260: Adds a Status update to a job as a user from ADMIN_GROUPS for another group's job in 'USER5.1' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdUserSpec2}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1270: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in 'USER5.1' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdUserSpec3}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1280: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1290: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her job in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1300: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's job in 'USER5.1' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1310: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her group in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1320: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's group in 'USER5.1' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1330: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for anonymous user's group in 'USER5.1' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1340: Adds a Status update to a job as user5.1 for his/her job in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1350: Adds a Status update to a job as user5.1 for another user's job in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1360: Adds a Status update to a job as user5.1 for his/her group in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1370: Adds a Status update to a job as user5.1 for another user's group in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1380: Adds a Status update to a job as user5.1 for anonymous user's group in 'USER5.1' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1390: Adds a Status update to a job as user5.2 for his/her job in 'USER5.1' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec7}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1400: Adds a Status update to a job as user5.2 for user's 5.1 in same group job in 'USER5.1' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1410: Adds a Status update to a job as user5.2 for another user in his/her group job in 'USER5.1' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdUserSpec5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1420: Adds a status update to a job as a user from ADMIN_GROUPS for his/her job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec1}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1430: Adds a Status update to a job as a user from ADMIN_GROUPS for another group's job in '@group5' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec2}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1440: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '@group5' configuration", async () => {
  return request(appUrl)
      .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec3}`)
      .send({
        statusMessage: "update status of a job",
        statusCode: "job finished/blocked/etc",
      })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulPatchStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1450: Adds a Status update to a job as a user from ADMIN_GROUPS for anonymous user's job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1460: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1470: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's job in '@group5' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1480: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for his/her group in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec3}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1490: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for another user's group in '@group5' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1500: Adds a Status update to a job as a user from UPDATE_JOB_GROUPS for anonymous user's group in '@group5' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1510: Adds a Status update to a job as user5.1 for his/her job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1520: Adds a Status update to a job as user5.1 for another user's job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec2}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1530: Adds a Status update to a job as user5.1 for his/her group in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1540: Adds a Status update to a job as user5.1 for another user's group in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1550: Adds a Status update to a job as user5.1 for anonymous user's group in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec6}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1560: Adds a Status update to a job as user5.2 for his/her job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec7}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });


  it("1570: Adds a Status update to a job as user5.2 for user's 5.1 in same group job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1580: Adds a Status update to a job as user5.2 for another user in his/her group job in '@group5' configuration", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec5}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1590: Adds a Status update to a job as user3 for his/her job in '@group5' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec8}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser3}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1600: Adds a Status update to a job as user3 for user's 5.1 job in '@group5' configuration, which should fail as forbidden", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdGroupSpec4}`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser3}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1610: Adds a status update to a job as a user from ADMIN_GROUPS for his/her job in '#all' configuration with non-existing jobId, which should fail as bad request", async () => {
    return request(appUrl)
        .patch(`/api/v3/Jobs/badJobId`)
        .send({
          statusMessage: "update status of a job",
          statusCode: "job finished/blocked/etc",
        })
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1620: Access jobs as a user from ADMIN_GROUPS ", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(64);
        });
  });

  it("1630: Access jobs as a user from ADMIN_GROUPS that were created by admin", async () => {
    const query = { where:{ createdBy: "admin" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(37);
        });
  });

  it("1640: Access jobs as a user from ADMIN_GROUPS that were created by User1", async () => {
    const query = { where:{ createdBy: "user1" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(11);
        });
  });

  it("1650: Access jobs as a user from ADMIN_GROUPS that were created by User5.1", async () => {
    const query = { where:{ createdBy: "user5.1" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(13);
        });
  });

  it("1660: Access jobs as a user from ADMIN_GROUPS that were created by User5.2", async () => {
    const query = { where:{ createdBy: "user5.2" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(1);
        });
  });

  it("1670: Access jobs as a user from ADMIN_GROUPS that were created by anonymous user", async () => {
    const query = { where:{ createdBy: "anonymous" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(2);
        });
  });

  it("1680: Access jobs as a user from CREATE_JOB_GROUPS ", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(25);
        });
  });

  it("1690: Access jobs as a user from CREATE_JOB_GROUPS that were created by admin", async () => {
    const query = { where:{ createdBy: "admin" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(14);
        });
  });

  it("1700: Access jobs as a user from CREATE_JOB_GROUPS that were created by User1", async () => {
    const query = { where:{ createdBy: "user1" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(11);
        });
  });

  it("1710: Access jobs as a normal user", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(13);
        });
  });

  it("1720: Access jobs as a normal user (user5.1) that were created by admin", async () => {
    const query = { where:{ createdBy: "admin" }};
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .query("filter=" + encodeURIComponent(JSON.stringify(query)))
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(0);
        });
  });

  it("1730: Access jobs as another normal user (user5.2)", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser52}` })
        .expect(TestData.SuccessfulGetStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.be.an("array").to.have.lengthOf(2);
        });
  });

  it("1740: Access jobs as unauthenticated user, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/`)
        .send({})
        .set("Accept", "application/json")
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/);
  });

  it("1750: Get admin's job as user from ADMIN_GROUP", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser1}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.have.property("ownerUser").and.be.equal("admin");
        });
  });

  it("1760: Get user1's job as user from ADMIN_GROUP", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser2}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.have.property("ownerUser").and.be.equal("user1");
        });
  });

  it("1770: Get group1's job as user from ADMIN_GROUP", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser3}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
          res.body.should.have.property("ownerGroup").and.be.equal("group1");
        });
  });

  it("1780: Get admin's job as user from ADMIN_GROUP", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1790: Get admin's job as user from CREATE_JOB_GROUP, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser1}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1800: Get his/her own job as user from CREATE_JOB_GROUP", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser2}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.have.property("ownerUser").and.be.equal("user1");
          res.body.should.have.property("ownerGroup").and.be.equal("group1");
        });
  });

  it("1810: Get a job from his/her own group as user from CREATE_JOB_GROUP", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser3}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
          res.body.should.have.property("ownerGroup").and.be.equal("group1");
        });
  });

  it("1820: Get other user's job as user from CREATE_JOB_GROUP, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser4}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1830: Get anonymous user's job as user from CREATE_JOB_GROUP, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1840: Get admin's job as normal, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser1}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1850: Get other user's job as normal user, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser2}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1860: Get his/her own job as normal user", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser4}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.have.property("ownerUser").and.be.equal('user5.1');
          res.body.should.have.property("ownerGroup").and.be.equal("group5");
        });
  });

  it("1870: Get job od another user in his/her group as normal user, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUserSpec7}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1880: Get job from his/her own group as normal user, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser5}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1890: Get anonymous user's job as normal user, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenUser51}` })
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1900: Get anonymous user's job as anonymous user, which should be forbidden", async () => {
    return request(appUrl)
        .get(`/api/v3/Jobs/${encodedJobIdUser6}`)
        .set("Accept", "application/json")
        .expect(TestData.AccessForbiddenStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("ownerUser");
        });
  });

  it("1910: Delete job 1 as Archive Manager", async () => {
    return request(appUrl)
      .delete("/api/v3/jobs/" + encodedJobIdUser1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(TestData.SuccessfulDeleteStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1920: Delete job 1 as Admin", async () => {
    return request(appUrl)
      .delete("/api/v3/jobs/" + encodedJobIdUser2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulDeleteStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1930: Delete job 1 as CREATE_JOB_GROUPS user, which should fail", async () => {
    return request(appUrl)
      .delete("/api/v3/jobs/" + encodedJobIdUser3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.DeleteForbiddenStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1940: Delete job 1 as normal user, which should fail", async () => {
    return request(appUrl)
      .delete("/api/v3/jobs/" + encodedJobIdUser3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.DeleteForbiddenStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1950: Delete job not existing in database as Archive Manager, which should fail", async () => {
    return request(appUrl)
      .delete("/api/v3/jobs/" + 'fakeJobId')
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(TestData.BadRequestStatusCode)
      .expect("Content-Type", /json/);
  });

  it("1960: Access jobs as a user from ADMIN_GROUPS, which should be one less than before proving that delete works.", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/`)
      .send({})
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(62);
      });
  });

  it("1970: Fullquery jobs as a user from ADMIN_GROUPS, limited by 5", async () => {
    const query = { limit: 5 };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .set("Accept", "application/json")
      .query("limits=" + encodeURIComponent(JSON.stringify(query)))
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(5);
      });
  });

  it("1980: Fullquery jobs as a user from ADMIN_GROUPS that were created by admin", async () => {
    const query = { createdBy: "admin" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(35);
      });
  });

  it("1990: Fullquery jobs as a user from ADMIN_GROUPS that were created by User1", async () => {
    const query = { createdBy: "user1" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(11);
      });
  });

  it("2000: Fullquery jobs as a user from ADMIN_GROUPS that were created by User5.1, limited by 5", async () => {
    const queryFields = { createdBy: "user5.1" };
    const queryLimits = { limit: 5 };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(queryFields)))
      .query("limits=" + encodeURIComponent(JSON.stringify(queryLimits)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(5);
      });
  });

  it("2010: Fullquery jobs as a user from ADMIN_GROUPS that were created by User5.2", async () => {
    const query = { createdBy: "user5.2" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(1);
      });
  });

  it("2020: Fullquery jobs as a user from ADMIN_GROUPS that were created by anonymous user", async () => {
    const query = { createdBy: "anonymous" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(2);
      });
  });

  it("2040: Fullquery jobs as a user from CREATE_JOB_GROUPS that were created by admin", async () => {
    const query = { createdBy: "admin" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(13);
      });
  });

  it("2050: Fullquery jobs as a user from CREATE_JOB_GROUPS that were created by User1", async () => {
    const query = { createdBy: "user1" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(11);
      });
  });

  it("2060: Fullquery jobs as a normal user", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(13);
      });
  });

  it("2070: Fullquery jobs as a normal user (user5.1) that were created by admin", async () => {
    const query = { createdBy: "admin" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(0);
      });
  });

  it("2080: Fullquery jobs as another normal user (user5.2)", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser52}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.lengthOf(2);
      });
  });

  it("2090: Fullquery jobs as unauthenticated user, which should be forbidden", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/fullquery`)
      .send({})
      .set("Accept", "application/json")
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/);
  });

  it("2100: Fullfacet jobs as unauthenticated user, which should be forbidden", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .set("Accept", "application/json")
      .expect(TestData.AccessForbiddenStatusCode)
      .expect("Content-Type", /json/);
  });

  it("2110: Fullfacet jobs as a user from ADMIN_GROUPS that were created by admin", async () => {
    const query = { createdBy: "admin" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 35 }] });
      });
  });

  it("2120: Fullfacet jobs as a user from ADMIN_GROUPS that were created by User1", async () => {
    const query = { createdBy: "user1" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 11 }] });
      });
  });

  it("2130: Fullfacet jobs as a user from ADMIN_GROUPS that were created by User5.1", async () => {
    const queryFields = { createdBy: "user5.1" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(queryFields)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 13 }] });
      });
  });

  it("2140: Fullfacet jobs as a user from ADMIN_GROUPS that were created by User5.2", async () => {
    const query = { createdBy: "user5.2" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 1 }] });
      });
  });

  it("2150: Fullfacet jobs as a user from ADMIN_GROUPS that were created by anonymous user", async () => {
    const query = { createdBy: "anonymous" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenAdmin}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 2 }] });
      });
  });

  it("2160: Fullfacet jobs as a user from CREATE_JOB_GROUPS that were created by admin", async () => {
    const query = { createdBy: "admin" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 13 }] });
      });
  });

  it("2170: Fullfacet jobs as a user from CREATE_JOB_GROUPS that were created by User1", async () => {
    const query = { createdBy: "user1" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 11 }] });
      });
  });

  it("2180: Fullfacet jobs as a normal user", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 13 }] });
      });
  });

  it("2190: Fullfacet jobs as a normal user (user5.1) that were created by admin", async () => {
    const query = { createdBy: "admin" };
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .query("fields=" + encodeURIComponent(JSON.stringify(query)))
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser51}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [] });
      });
  });

  it("2200: Fullfacet jobs as another normal user (user5.2)", async () => {
    return request(appUrl)
      .get(`/api/v3/Jobs/fullfacet`)
      .send({})
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser52}` })
      .expect(TestData.SuccessfulGetStatusCode)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").that.deep.contains({ all: [{ totalSets: 2 }] });
      });
  });

  describe("3120: Validate Job Action", () => {

    it("0010: create validate job fails without required parameters", async () => {
      const newDataset = {
        ...jobValidate,
        jobParams: {
          optionalParam: false,
        },
      };

      return request(appUrl)
        .post("/api/v3/Jobs")
        .send(newDataset)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("type")
          res.body.should.have.property("message").and.be.equal("Invalid request. Requires 'jobParams.requiredParam'");
        });
    });

    it("0020: create validate job fails with the wrong types", async () => {
      const newDataset = {
        type: "validate",
        jobParams: {
          requiredParam: 123,
          arrayOfStrings: ["ok"]
        },
      };

      return request(appUrl)
        .post("/api/v3/Jobs")
        .send(newDataset)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("type")
          res.body.should.have.property("message").and.be.equal("Invalid request. Invalid value for 'jobParams.requiredParam'");
        });
    });
    it("0030: create validate job fails with the wrong types", async () => {
      const newDataset = {
        type: "validate",
        jobParams: {
          requiredParam: "ok",
          arrayOfStrings: "bad"
        },
      };

      return request(appUrl)
        .post("/api/v3/Jobs")
        .send(newDataset)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("type")
          res.body.should.have.property("message").and.be.equal("Invalid request. Invalid value for 'jobParams.arrayOfStrings'");
        });
    });
    it("0040: create validate job fails with the wrong types", async () => {
      const newDataset = {
        type: "validate",
        jobParams: {
          requiredParam: "ok",
          arrayOfStrings: [123]
        },
      };

      return request(appUrl)
        .post("/api/v3/Jobs")
        .send(newDataset)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("type")
          res.body.should.have.property("message").and.be.equal("Invalid request. Invalid value for 'jobParams.arrayOfStrings'");
        });
    });

    it("0050: create validate succeeds with the right types", async () => {
      const newDataset = {
        type: "validate",
        jobParams: {
          requiredParam: "ok",
          arrayOfStrings: ["ok"]
        },
      };

      return request(appUrl)
        .post("/api/v3/Jobs")
        .send(newDataset)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.EntryCreatedStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.have.property("type").and.equal("validate");
          res.body.should.have.property("createdBy").and.equal("admin");
          res.body.should.have.property("jobParams").that.deep.equals(newDataset.jobParams);

          jobIdValidate1 = res.body["id"];
          encodedJobIdValidate1 = encodeURIComponent(jobIdValidate1);
        });
    });

    it("0060: update validate fails without the required parameters", async () => {
      const update = {
        statusCode: "finished",
        statusMessage: "done",
        jobResultObject: {
          requiredParam: "ok",
          arrayOfStringsMissing: ["fail"]
        }
      };

      return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdValidate1}`)
        .send(update)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("type")
          res.body.should.have.property("message").and.be.equal("Invalid request. Invalid value for '$'");
        });

    });

    it("0070: update validate fails with incorrect types", async () => {
      const update = {
        statusCode: "finished",
        statusMessage: "done",
        jobResultObject: {
          requiredParam: "ok",
          arrayOfStringsMissing: [123]
        }
      };

      return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdValidate1}`)
        .send(update)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.BadRequestStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.not.have.property("type")
          res.body.should.have.property("message").and.be.equal("Invalid request. Invalid value for '$'");
        });

    });


    it("0080: updating validate succeeds with the required parameters", async () => {
      const update = {
        statusCode: "finished",
        statusMessage: "done",
        jobResultObject: {
          requiredParam: "ok",
          arrayOfStrings: ["ok"]
        }
      };

      return request(appUrl)
        .patch(`/api/v3/Jobs/${encodedJobIdValidate1}`)
        .send(update)
        .set("Accept", "application/json")
        .set({ Authorization: `Bearer ${accessTokenAdmin}` })
        .expect(TestData.SuccessfulPatchStatusCode)
        .expect("Content-Type", /json/)
        .then((res) => {
          res.body.should.have.property("type").and.equal("validate");
          res.body.should.have.property("createdBy").and.equal("admin");
          res.body.should.have.property("jobParams").that.deep.equals(update.jobResultObject);
          res.body.should.have.property("jobResultObject").that.deep.equals(update.jobResultObject);
        });
    });
  });
});
