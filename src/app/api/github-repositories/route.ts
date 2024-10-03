import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type OctokitRepo = Awaited<
  ReturnType<Octokit["repos"]["listForAuthenticatedUser"]>
>["data"][number];
type GitHubRepository = OctokitRepo;

interface LocalRepository {
  images: string[];
  longDescription: string;
  demoUrl: string;
  technologies: string[];
}

interface LocalData {
  [key: string]: LocalRepository;
}

interface MergedRepository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  images: string[];
  longDescription: string;
  demoUrl: string;
  technologies: string[];
  createdAt: string | null;
}
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const dataFilePath = path.join(process.cwd(), "src", "data", "repo-data.json");
let localData: LocalData;
try {
  localData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
} catch (error) {
  console.error("Error loading local data:", error);
  localData = {};
}
function mergeRepoData(
  ghRepo: GitHubRepository,
  localRepoData: LocalRepository | undefined
): MergedRepository {
  return {
    id: ghRepo.id,
    name: ghRepo.name,
    description: ghRepo.description,
    url: ghRepo.html_url,
    images: localRepoData?.images || ["default.webp"],
    longDescription: localRepoData?.longDescription || ghRepo.description || "",
    demoUrl: localRepoData?.demoUrl || "",
    technologies: localRepoData?.technologies || [],
    createdAt: ghRepo.created_at,
  };
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN is not set");
    }

    if (id) {
      const response = await octokit.repos.listForAuthenticatedUser({
        sort: "created",
        direction: "desc",
        per_page: 100,
      });

      const ghRepo = response.data.find((repo) => repo.id.toString() === id);

      if (!ghRepo) {
        console.log("Repository not found for id:", id);
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }

      const localRepoData = localData[ghRepo.name];
      const repo = mergeRepoData(ghRepo, localRepoData);

      return NextResponse.json(repo);
    } else {
      const response = await octokit.repos.listForAuthenticatedUser({
        sort: "created",
        direction: "desc",
        per_page: 100,
      });

      const repositories = response.data
        .filter((repo) => repo.name !== "AlexMist23")
        .slice(0, 10)
        .map((ghRepo) => {
          const localRepoData = localData[ghRepo.name];
          return mergeRepoData(ghRepo, localRepoData);
        });

      return NextResponse.json(repositories);
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch repositories",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
