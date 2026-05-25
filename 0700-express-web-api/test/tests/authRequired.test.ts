import { describe, expect, it } from "vitest";
import { apiRequest } from "./support/http";
import { missingTaskId, seedProject } from "./testData";

type ProtectedEndpoint = {
  name: string;
  path: string;
  options?: RequestInit;
};

const protectedEndpoints: ProtectedEndpoint[] = [
  {
    name: "GET /users/me",
    path: "/users/me"
  },
  {
    name: "GET /users/projects",
    path: "/users/projects?limit=1&page=1"
  },
  {
    name: "GET /users/projects/:slug",
    path: `/users/projects/${seedProject.slug}`
  },
  {
    name: "GET /users/tasks",
    path: "/users/tasks?limit=20&page=1&status=scheduled"
  },
  {
    name: "POST /users/tasks",
    path: "/users/tasks",
    options: {
      method: "POST",
      body: JSON.stringify({
        title: "Unauthorized task",
        kind: "task",
        description: "Created without token.",
        status: "scheduled",
        projectId: "00000000-0000-4000-8000-000000000000",
        startingAt: "2024-01-01",
        deadline: "2024-12-31"
      })
    }
  },
  {
    name: "GET /users/tasks/:id",
    path: `/users/tasks/${missingTaskId}`
  },
  {
    name: "PATCH /users/tasks/:id",
    path: `/users/tasks/${missingTaskId}`,
    options: {
      method: "PATCH",
      body: JSON.stringify({
        title: "Unauthorized task updated",
        kind: "task",
        description: "Updated without token.",
        status: "completed",
        projectId: "00000000-0000-4000-8000-000000000000",
        startingAt: "2024-01-01",
        deadline: "2024-12-31"
      })
    }
  },
  {
    name: "DELETE /users/tasks/:id",
    path: `/users/tasks/${missingTaskId}`,
    options: {
      method: "DELETE"
    }
  }
];

describe("Authentication Required API", () => {
  it.each(protectedEndpoints)(
    "$name はトークンなしの場合 401 を返す",
    async ({ path, options }) => {
      const response = await apiRequest(path, options);

      expect(response.status).toBe(401);
    }
  );
});
