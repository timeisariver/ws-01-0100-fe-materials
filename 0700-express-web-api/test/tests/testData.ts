export const seedUser = {
  email: "test@example.com",
  password: "password",
  username: "Test User",
  status: "active"
} as const;

export const seedProjects = [
  { slug: "programming" },
  { slug: "english" },
  { slug: "design" }
] as const;

export const seedProject = seedProjects[0];

export const missingProjectSlug = "missing-project-for-api-test";

export const missingTaskId = "00000000-0000-4000-8000-000000000000";

export function createProjectPayload(slug: string): Record<string, string> {
  return {
    name: `API test project ${slug}`,
    slug,
    goal: "Created by black-box API test.",
    shouldbe: "It should be available through the project API.",
    color: "#FF0000",
    startingAt: "2024-01-01T00:00:00.000Z",
    deadline: "2024-12-31T00:00:00.000Z"
  };
}
