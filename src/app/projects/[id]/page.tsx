"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import MarkdownRenderer from "@/components/markdown-renderer";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  longDescription: string;
  url: string;
  images: string[];
  demoUrl: string;
  readmeContent: string; // Add readmeContent to the type
}

async function getRepository(id: string) {
  const url = `/api/github/repository?id=${id}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("Error response:", res.status, res.statusText);
    return null;
  }

  return res.json();
}

async function getReadme(owner: string, repo: string) {
  const url = `/api/github/repo-readme?owner=${owner}&repo=${repo}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("Error fetching README:", res.status, res.statusText);
    return null;
  }

  return res.json();
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const repository = await getRepository(params.id);
      if (!repository) {
        notFound();
      } else {
        const readme = await getReadme("AlexMist23", repository.name); // Replace with actual owner name
        console.log(readme);
        repository.readmeContent = readme?.content || ""; // Assign the readme content
        setRepo(repository);
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!repo) {
    notFound();
  }

  return (
    <div className="container max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-background">
      <Card className="border shadow-lg border-muted-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {repo.name}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {repo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Carousel className="relative w-full rounded-lg shadow-md">
            <CarouselContent>
              {repo.images.map((img: string, i: number) => (
                <CarouselItem key={i}>
                  <AspectRatio ratio={16 / 9} className="w-full h-full">
                    <Image
                      src={`/images/repos/${img}`}
                      alt={repo.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                      priority
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute z-10 p-2 transform -translate-y-1/2 rounded-full shadow-md left-4 top-1/2 bg-background hover:bg-primary" />
            <CarouselNext className="absolute z-10 p-2 transform -translate-y-1/2 rounded-full shadow-md right-4 top-1/2 bg-background hover:bg-primary" />
          </Carousel>
          <div className="flex mt-4 space-x-4">
            <Button asChild className="bg-primary">
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
            {repo.demoUrl && (
              <Button asChild variant="outline" className="border-primary">
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
          <p className="mt-4 text-lg leading-relaxed text-foreground">
            {repo.longDescription}
          </p>
          <MarkdownRenderer markdown={repo.readmeContent} />
        </CardContent>
      </Card>
    </div>
  );
}
