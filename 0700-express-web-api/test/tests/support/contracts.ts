import { expect } from "vitest";
import {
  expectNonEmptyString,
  expectOptionalIsoDateTime,
  expectUuid
} from "./assertions";

export type Project = {
  id: string;
  name: string;
  slug?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "scheduled" | "completed" | "archived";
  project?: Project;
};

export function expectAuthData(value: unknown): void {
  expect(value).toEqual(
    expect.objectContaining({
      uuid: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    })
  );

  const auth = value as { uuid: unknown; accessToken: unknown; refreshToken: unknown };
  expectUuid(auth.uuid);
  expectNonEmptyString(auth.accessToken);
  expectNonEmptyString(auth.refreshToken);
}

export function expectUser(value: unknown): void {
  expect(value).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      status: expect.stringMatching(/^(active|deactive)$/)
    })
  );

  expectUuid((value as { id: unknown }).id);
}

export function expectProject(value: unknown): asserts value is Project {
  expect(value).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String)
    })
  );

  expectUuid((value as { id: unknown }).id);
}

export function expectTask(value: unknown): asserts value is Task {
  expect(value).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      status: expect.stringMatching(/^(scheduled|completed|archived)$/)
    })
  );

  const task = value as Record<string, unknown>;
  expectUuid(task.id);
  expectOptionalIsoDateTime(task.createdAt);
  expectOptionalIsoDateTime(task.updatedAt);

  if (task.project !== undefined && task.project !== null) {
    expectProject(task.project);
  }
}
