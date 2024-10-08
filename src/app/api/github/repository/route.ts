import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Type Definitions
type OctokitRepo = Awaited<
  ReturnType<Octokit["repos"]["listForAuthenticatedUser"]>
>["data"][number];
type GitHubRepository = OctokitRepo;

interface LocalRepository {
  images?: string[];
  longDescription?: string;
  demoUrl?: string;
  technologies?: string[];
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
  };
}

// GET Function for Single Repository
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Repository ID is required." },
        { status: 400 }
      );
    }

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
  } catch (error) {
    console.error("Error fetching repository:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch repository",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
