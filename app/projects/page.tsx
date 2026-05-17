import { fetchProjectsServer } from "@/services/projectsApi";
import ProjectsContent from "@/components/ProjectsContent";

/**
 * ISR revalidation period (in seconds).
 * Next.js will re-generate this page every 1 hour on demand,
 * ensuring search engines always see fresh content.
 */
export const revalidate = 3600;

/**
 * Static Site Generation (SSG) for /projects.
 *
 * Previously this page was `"use client"`, meaning the server only sent
 * an empty loading shell — Google could not index any project listings,
 * stats, or descriptions.
 *
 * Now the server:
 *   1. Fetches all projects at BUILD TIME (SSG).
 *   2. Renders them into the static HTML sent to every visitor.
 *   3. Periodically revalidates (ISR) so the content stays fresh.
 *
 * The client wrapper receives the pre-fetched data and:
 *   - Shows it immediately (no loading spinner).
 *   - Handles client-side city filtering interactively.
 */
export default async function ProjectsPage() {
  const projects = await fetchProjectsServer();

  return <ProjectsContent initialProjects={projects} />;
}
