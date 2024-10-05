import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type OctokitRepo = Awaited<
  ReturnType<Octokit["repos"]["listForAuthenticatedUser"]>
>["data"][number];
type GitHubRepository = OctokitRepo;

interface LocalRepository {
  images?: string[];
  longDescription?: string;
  demoUrl?: string;
  technologies?: string[];
  inDevelopment?: boolean;
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
  demoUrl: string;
  technologies: string[];
  createdAt: string | null;
  inDevelopment?: boolean;
}

// Load Local Data
const dataFilePath = path.join(process.cwd(), "src", "data", "repo-data.json");
let localData: LocalData;

try {
  localData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
} catch (error) {
  console.error("Error loading local data:", error);
  localData = {};
}

// Merge Repository Data Function
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
    demoUrl: localRepoData?.demoUrl || "",
    technologies: localRepoData?.technologies || [],
    createdAt: ghRepo.created_at,
    inDevelopment: localRepoData?.inDevelopment || true,
  };
}

// GET Function for All Repositories
export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  try {
    const response = await octokit.repos.listForAuthenticatedUser({
      sort: "created",
      direction: "desc",
      per_page: 100,
    });

    const repositories = response.data
      .filter((repo) => repo.name !== "AlexMist23")
      .slice(0, 10) // Limit to 10 repositories, you can adjust as needed
      .map((ghRepo) => {
        const localRepoData = localData[ghRepo.name];
        return mergeRepoData(ghRepo, localRepoData);
      });

    return NextResponse.json(repositories);
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
