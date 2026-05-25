import { describe, expect, it } from "vitest";
import { expectUser } from "./support/contracts";
import { apiRequest, apiRequestWithToken, loginAsSeedUser } from "./support/http";
import { seedUser } from "./testData";

describe("User API", () => {
  it("認証済みユーザー自身の情報を取得できる", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken<{ data: unknown }>("/users/me", token);

    expect(response.status).toBe(200);
    expectUser(response.body.data);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        email: seedUser.email,
        status: seedUser.status
      })
    );
  });

  it("未認証の場合は 401 を返す", async () => {
    const response = await apiRequest("/users/me");

    expect(response.status).toBe(401);
  });
});
