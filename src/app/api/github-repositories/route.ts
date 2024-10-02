import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const dataFilePath = path.join(process.cwd(), "data", "repo-data.json");
let localData;
try {
  localData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
} catch (error) {
  console.error("Error loading local data:", error);
  localData = {};
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  console.log("Received request with id:", id); // Debug log

  try {
    if (id) {
      console.log("Fetching single repository with id:", id); // Debug log
      const response = await octokit.repos.listForAuthenticatedUser({
        sort: "updated",
        per_page: 100,
      });

      const ghRepo = response.data.find((repo) => repo.id.toString() === id);

      if (!ghRepo) {
        console.log("Repository not found for id:", id); // Debug log
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }

      const localRepoData = localData[ghRepo.name] || {};

      const repo = {
        id: ghRepo.id,
        name: ghRepo.name,
        description: ghRepo.description,
        url: ghRepo.html_url,
        image: localRepoData.image || "default.jpg",
        longDescription: localRepoData.longDescription,
        demoUrl: localRepoData.demoUrl,
      };

      console.log("Returning single repository:", repo.name); // Debug log
      return NextResponse.json(repo);
    } else {
      console.log("Fetching list of repositories"); // Debug log
      const response = await octokit.repos.listForAuthenticatedUser({
        sort: "updated",
        per_page: 10,
      });

      const repositories = response.data.map((ghRepo) => {
        const localRepoData = localData[ghRepo.name] || {};
        return {
          id: ghRepo.id,
          name: ghRepo.name,
          description: ghRepo.description,
          url: ghRepo.html_url,
          image: localRepoData.image || "default.jpg",
          longDescription: localRepoData.longDescription,
          demoUrl: localRepoData.demoUrl,
        };
      });

      console.log(
        "Returning list of repositories, count:",
        repositories.length
      ); // Debug log
      return NextResponse.json(repositories);
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
