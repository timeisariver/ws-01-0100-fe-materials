import { describe, expect, it } from "vitest";
import { expectPageInfo } from "./support/assertions";
import { Project, Task, expectProject, expectTask } from "./support/contracts";
import { apiRequestWithToken, loginAsSeedUser } from "./support/http";
import { missingTaskId, seedProject } from "./testData";

async function getSeedProject(token: string): Promise<Project> {
  const response = await apiRequestWithToken<{ data: unknown }>(
    `/users/projects/${seedProject.slug}`,
    token
  );

  expect(response.status).toBe(200);
  expectProject(response.body.data);

  return response.body.data;
}

describe("Task API", () => {
  it("タスク一覧を status で絞り込める", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken<{ data: unknown[]; pageInfo: unknown }>(
      "/users/tasks?limit=20&page=1&status=scheduled",
      token
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expectPageInfo(response.body.pageInfo, { limit: 20, page: 1 });

    response.body.data.forEach((task) => {
      expectTask(task);
      expect(task).toEqual(
        expect.objectContaining({
          status: "scheduled"
        })
      );
    });
  });

  it("タスクを作成し、取得・更新・削除できる", async () => {
    const token = await loginAsSeedUser();
    const project = await getSeedProject(token);
    const title = `API test task ${crypto.randomUUID()}`;

    const createResponse = await apiRequestWithToken<{ data: unknown }>(
      "/users/tasks",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          title,
          kind: "task",
          description: "Created by black-box API test.",
          status: "scheduled",
          projectId: project.id,
          startingAt: "2024-01-01",
          deadline: "2024-12-31"
        })
      }
    );

    expect(createResponse.status).toBe(201);
    expectTask(createResponse.body.data);
    expect(createResponse.body.data).toEqual(
      expect.objectContaining({
        title,
        description: "Created by black-box API test.",
        status: "scheduled"
      })
    );

    const createdTask = createResponse.body.data as Task;

    const getResponse = await apiRequestWithToken<{ data: unknown }>(
      `/users/tasks/${createdTask.id}`,
      token
    );

    expect(getResponse.status).toBe(200);
    expectTask(getResponse.body.data);
    expect(getResponse.body.data).toEqual(
      expect.objectContaining({
        id: createdTask.id,
        title
      })
    );

    const updateResponse = await apiRequestWithToken<{ data: unknown }>(
      `/users/tasks/${createdTask.id}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({
          title: `${title} updated`,
          kind: "task",
          description: "Updated by black-box API test.",
          status: "completed",
          projectId: project.id,
          startingAt: "2024-01-01",
          deadline: "2024-12-31"
        })
      }
    );

    expect(updateResponse.status).toBe(200);
    expectTask(updateResponse.body.data);
    expect(updateResponse.body.data).toEqual(
      expect.objectContaining({
        id: createdTask.id,
        title: `${title} updated`,
        description: "Updated by black-box API test.",
        status: "completed"
      })
    );

    const deleteResponse = await apiRequestWithToken<{ data: unknown }>(
      `/users/tasks/${createdTask.id}`,
      token,
      {
        method: "DELETE"
      }
    );

    expect(deleteResponse.status).toBe(200);
    expectTask(deleteResponse.body.data);
    expect(deleteResponse.body.data).toEqual(
      expect.objectContaining({
        id: createdTask.id
      })
    );
  });

  it("不正な payload でタスク作成すると 400 を返す", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken("/users/tasks", token, {
      method: "POST",
      body: JSON.stringify({
        title: ""
      })
    });

    expect(response.status).toBe(400);
  });

  it("存在しない task ID は 404 を返す", async () => {
    const token = await loginAsSeedUser();

    const response = await apiRequestWithToken(`/users/tasks/${missingTaskId}`, token);

    expect(response.status).toBe(404);
  });
});
