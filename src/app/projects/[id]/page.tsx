import { notFound } from "next/navigation";
import Image from "next/image";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getRepository(id: string) {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const url = `${protocol}://${host}/api/github-repositories?id=${id}`;
  console.log("Fetching from URL:", url); // Debug log

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error response:", res.status, res.statusText); // Debug log
    return null;
  }
  return res.json();
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const repo = await getRepository(params.id);

  if (!repo) {
    notFound();
  }

  return (
    <div className="container p-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{repo.name}</CardTitle>
          <CardDescription>{repo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 aspect-video">
            <Image
              src={`/images/repos/${repo.images[0]}`}
              alt={repo.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <p className="mb-4">{repo.longDescription}</p>
          <div className="flex space-x-4">
            <Button asChild>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
            {repo.demoUrl && (
              <Button asChild variant="outline">
                <a
                  href={repo.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
