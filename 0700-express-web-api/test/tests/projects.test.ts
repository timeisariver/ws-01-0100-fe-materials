import { describe, expect, it } from "vitest";
import { expectPageInfo } from "./support/assertions";
import { expectProject } from "./support/contracts";
import { apiRequestWithToken, loginAsSeedUser } from "./support/http";
import { missingProjectSlug, seedProject } from "./testData";

describe("Project API", () => {
  it("プロジェクト一覧をページネーション付きで取得できる", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken<{ data: unknown[]; pageInfo: unknown }>(
      "/users/projects?limit=1&page=1",
      token
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(1);
    expectPageInfo(response.body.pageInfo, { limit: 1, page: 1 });
    response.body.data.forEach(expectProject);
  });

  it("slug でプロジェクトを取得できる", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken<{ data: unknown }>(
      `/users/projects/${seedProject.slug}`,
      token
    );

    expect(response.status).toBe(200);
    expectProject(response.body.data);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        slug: seedProject.slug
      })
    );
  });

  it("存在しない slug は 404 を返す", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken(
      `/users/projects/${missingProjectSlug}`,
      token
    );

    expect(response.status).toBe(404);
  });
});
