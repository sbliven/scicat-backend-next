/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const utils = require("./LoginUtils");
const { TestData } = require("./TestData");

let accessTokenIngestor = null,
  accessTokenArchiveManager = null,
  accessTokenUser1 = null,
  instrumentId1 = null,
  encodedInstrumentId1 = null,
  instrumentId2 = null,
  encodedInstrumentId2 = null,
  instrumentId3 = null,
  encodedInstrumentId3 = null;

const newName = "ESS2.5";

describe("0900: Instrument: instrument management, creation, update, deletion and search", () => {
  beforeEach((done) => {
    utils.getToken(
      appUrl,
      {
        username: "ingestor",
        password: "aman",
      },
      (tokenVal) => {
        accessTokenIngestor = tokenVal;
        utils.getToken(
          appUrl,
          {
            username: "archiveManager",
            password: "aman",
          },
          (tokenVal) => {
            accessTokenArchiveManager = tokenVal;
            utils.getToken(
              appUrl,
              {
                username: "user1",
                password: "a609316768619f154ef58db4d847b75e",
              },
              (tokenVal) => {
                accessTokenUser1 = tokenVal;
                done();
              },
            );
          },
        );
      },
    );
  });

  it("0010: adds new instrument #1 as ingestor", async () => {
    return request(appUrl)
      .post("/api/v3/Instruments")
      .send(TestData.InstrumentCorrect1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have
          .property("name")
          .and.be.equal(TestData.InstrumentCorrect1.name);
        res.body.should.have.property("pid").and.be.string;
        instrumentId1 = res.body["pid"];
        encodedInstrumentId1 = encodeURIComponent(instrumentId1);
      });
  });

  it("0020: adds new instrument #2 as ingestor", async () => {
    return request(appUrl)
      .post("/api/v3/Instruments")
      .send(TestData.InstrumentCorrect2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have
          .property("name")
          .and.be.equal(TestData.InstrumentCorrect2.name);
        res.body.should.have.property("pid").and.be.string;
        instrumentId2 = res.body["pid"];
        encodedInstrumentId2 = encodeURIComponent(instrumentId2);
      });
  });

  it("0030: adds new instrument #3 as ingestor", async () => {
    return request(appUrl)
      .post("/api/v3/Instruments")
      .send(TestData.InstrumentCorrect3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have
          .property("name")
          .and.be.equal(TestData.InstrumentCorrect3.name);
        res.body.should.have.property("pid").and.be.string;
        instrumentId3 = res.body["pid"];
        encodedInstrumentId3 = encodeURIComponent(instrumentId3);
      });
  });

  it("0040: adds instrument #2 again as ingestor, which should fail", async () => {
    return request(appUrl)
      .post("/api/v3/Instruments")
      .send(TestData.InstrumentCorrect2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(400);
  });

  it("0050: adds invalid instrument as ingestor, which should fail", async () => {
    return request(appUrl)
      .post("/api/v3/Instruments")
      .send(TestData.InstrumentWrong1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(400);
  });

  it("0060: adds instrument #2 as user1 (non admin), which should fail", async () => {
    return request(appUrl)
      .post("/api/v3/Instruments")
      .send(TestData.InstrumentCorrect2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(403);
  });

  it("0070: should fetch instrument #1 as ingestor", async () => {
    return request(appUrl)
      .get("/api/v3/Instruments/" + instrumentId1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have
          .property("name")
          .and.be.equal(TestData.InstrumentCorrect1.name);
        res.body.should.have.property("pid").and.be.equal(instrumentId1);
      });
  });

  it("0080: should fetch instrument #2 as ingestor", async () => {
    return request(appUrl)
      .get("/api/v3/Instruments/" + instrumentId2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have
          .property("name")
          .and.be.equal(TestData.InstrumentCorrect2.name);
        res.body.should.have.property("pid").and.be.equal(instrumentId2);
      });
  });

  it("0090: should fetch all instruments as ingestor", async () => {
    return request(appUrl)
      .get("/api/v3/Instruments")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.length(3);
      });
  });

  it("0100: should fetch all instruments with main_user as ESS as ingestor", async () => {
    const filter = {
      where: {
        "customMetadata.main_user": "ESS",
      },
    };

    return request(appUrl)
      .get("/api/v3/Instruments")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query({ filter: JSON.stringify(filter) })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.length(2);
        res.body.forEach((v) => {
          v.customMetadata.main_user.should.be.equal("ESS");
        });
      });
  });

  it("0110: should fetch one instruments as ingestor", async () => {
    return request(appUrl)
      .get("/api/v3/Instruments/findOne")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.pid.should.be.oneOf([ instrumentId1, instrumentId2, instrumentId3 ]);
      });
  });

  it("0120: should fetch one instruments with main_user as ESS as admin", async () => {
    const filter = {
      where: {
        "customMetadata.main_user": "ESS",
      },
    };

    return request(appUrl)
      .get("/api/v3/Instruments/findOne")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query({ filter: JSON.stringify(filter) })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.pid.should.be.oneOf([ instrumentId1, instrumentId2 ]);
        res.body.customMetadata.main_user.should.be.equal("ESS");
      });
  });

  it("0130: should fetch all instruments which main user containing the word 'somebody' as ingestor", async () => {
    const filter = {
      where: {
        "customMetadata.main_user": {like : "somebody"},
      },
    };

    return request(appUrl)
      .get("/api/v3/Instruments")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query({ filter: JSON.stringify(filter) })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.length(1);
        res.body[0].pid.should.be.equal(instrumentId3);
        res.body[0].customMetadata.main_user.should.be.contain("somebody");
      });
  });

  it("0140: should fetch all instruments as user1", async () => {
    return request(appUrl)
      .get("/api/v3/Instruments")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenUser1}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.length(3);
      });
  });

  it("0150: should update name for instrument #2 as ingestor", async () => {
    return request(appUrl)
      .patch("/api/v3/Instruments/" + instrumentId2)
      .send({ name: newName })
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("name").and.be.equal(newName);
        res.body.should.have.property("pid").and.be.equal(instrumentId2);
      });
  });

  it("0160: should fetch same instrument by id as ingestor", async () => {
    return request(appUrl)
      .get("/api/v3/Instruments/" + instrumentId2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.have.property("name").and.be.equal(newName);
        res.body.should.have.property("pid").and.be.equal(instrumentId2);
      });
  });

  it("0170: should fetch same instrument by name", async () => {
    const filter = {
      where: {
        name: newName
      },
    };

    return request(appUrl)
      .get("/api/v3/Instruments/")
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .query({ filter: JSON.stringify(filter) })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        res.body.should.be.an("array").to.have.length(1);
        res.body.forEach((v) => {
          v.should.have.property("name").and.be.equal(newName);
          v.should.have.property("pid").and.be.equal(instrumentId2);
        });
      });
  });

  it("0180: should delete instrument #1 as admin, which should fail", async () => {
    return request(appUrl)
      .delete("/api/v3/Instruments/" + instrumentId1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenIngestor}` })
      .expect(403);
  });

  it("0190: should delete instrument #1 as user allowed to delete", async () => {
    return request(appUrl)
      .delete("/api/v3/Instruments/" + instrumentId1)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200);
  });

  it("0200: should delete instrument #2 as user allowed to delete", async () => {
    return request(appUrl)
      .delete("/api/v3/Instruments/" + instrumentId2)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200);
  });

  it("0210: should delete instrument #3 as user allowed to delete", async () => {
    return request(appUrl)
      .delete("/api/v3/Instruments/" + instrumentId3)
      .set("Accept", "application/json")
      .set({ Authorization: `Bearer ${accessTokenArchiveManager}` })
      .expect(200);
  });
});
