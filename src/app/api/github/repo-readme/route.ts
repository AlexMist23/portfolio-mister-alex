import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// GET function for fetching README
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Owner and repo parameters are required." },
      { status: 400 }
    );
  }

  try {
    const response = await octokit.repos.getReadme({
      owner,
      repo,
    });

    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching README:", error);

    // Use type assertion to specify that error is of type any
    const octokitError = error as { status?: number; message?: string };

    if (octokitError.status === 404) {
      return NextResponse.json({ error: "README not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch README",
        details: octokitError.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
