import { describe, expect, it } from "vitest";
import { expectPageInfo } from "./support/assertions";
import { Project, Task, expectProject, expectTask } from "./support/contracts";
import { apiRequestWithToken, loginAsSeedUser } from "./support/http";
import { missingProjectId, missingTaskId, seedProject } from "./testData";

type TaskPayload = {
  title: string;
  kind: string;
  description: string;
  status: string;
  projectId: string;
  startingAt: string;
  deadline: string;
};

type InvalidTaskPayloadCase = {
  name: string;
  override: Partial<TaskPayload>;
};

const invalidTaskPayloadCases: InvalidTaskPayloadCase[] = [
  {
    name: "不正な status",
    override: {
      status: "invalid-status"
    }
  },
  {
    name: "存在しない project id",
    override: {
      projectId: missingProjectId
    }
  },
  {
    name: "不正な kind",
    override: {
      kind: "invalid-kind"
    }
  },
  {
    name: "不正な deadline",
    override: {
      deadline: "invalid-date"
    }
  }
];

async function getSeedProject(token: string): Promise<Project> {
  const response = await apiRequestWithToken<{ data: unknown }>(
    `/users/projects/${seedProject.slug}`,
    token
  );

  expect(response.status).toBe(200);
  expectProject(response.body.data);

  return response.body.data;
}

function createTaskPayload(projectId: string, override: Partial<TaskPayload> = {}): TaskPayload {
  return {
    title: `API test task ${crypto.randomUUID()}`,
    kind: "task",
    description: "Created by black-box API test.",
    status: "scheduled",
    projectId,
    startingAt: "2024-01-01",
    deadline: "2024-12-31",
    ...override
  };
}

async function createTask(token: string, projectId: string): Promise<Task> {
  const response = await apiRequestWithToken<{ data: unknown }>("/users/tasks", token, {
    method: "POST",
    body: JSON.stringify(createTaskPayload(projectId))
  });

  expect(response.status).toBe(201);
  expectTask(response.body.data);

  return response.body.data;
}

async function deleteTask(token: string, taskId: string): Promise<void> {
  await apiRequestWithToken(`/users/tasks/${taskId}`, token, {
    method: "DELETE"
  });
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

describe("Task API Create Validation", () => {
  it.each(invalidTaskPayloadCases)(
    "$name を指定した場合、400 Bad Request を返す",
    async ({ override }) => {
      const token = await loginAsSeedUser();
      const project = await getSeedProject(token);

      const response = await apiRequestWithToken("/users/tasks", token, {
        method: "POST",
        body: JSON.stringify(createTaskPayload(project.id, override))
      });

      expect(response.status).toBe(400);
    }
  );
});

describe("Task API Update Validation", () => {
  it.each(invalidTaskPayloadCases)(
    "$name を指定した場合、400 Bad Request を返す",
    async ({ override }) => {
      const token = await loginAsSeedUser();
      const project = await getSeedProject(token);
      const task = await createTask(token, project.id);

      try {
        const response = await apiRequestWithToken(`/users/tasks/${task.id}`, token, {
          method: "PATCH",
          body: JSON.stringify(createTaskPayload(project.id, override))
        });

        expect(response.status).toBe(400);
      } finally {
        await deleteTask(token, task.id);
      }
    }
  );
});
