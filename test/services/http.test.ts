import { expect, test } from "@oclif/test";

import * as MockHelper from "../helpers/mock-helper";
import { STACKPATH_HOST } from "../../src/api/constants";
import { request } from "../../src/api/services/http";

describe("service http", () => {
  const credentials = {
    client_id: "some client id",
    client_secret: "some client secret",
    access_token: "some access token",
    access_token_expiry: 1234
  };

  test
    .nock(STACKPATH_HOST, MockHelper.mockDeployPost(false))
    .it("should perform an http post call", async () => {
      await request("POST", `/cdn/v1/stacks/1/sites/2/scripts`, credentials);
    });

  test
    .nock(STACKPATH_HOST, MockHelper.mockDeployPatch(false))
    .it("should perform an http patch call", async () => {
      await request("PATCH", `/cdn/v1/stacks/1/sites/2/scripts/3`, credentials);
    });

  test
    .nock(STACKPATH_HOST, MockHelper.mockHttpError(false))
    .it("should not throw an http error", async () => {
      let error: Error | undefined;
      try {
        await request("POST", `/error`, credentials, {});
      } catch (e) {
        error = e;
      }
      expect(error).to.be.undefined;
    });
});
