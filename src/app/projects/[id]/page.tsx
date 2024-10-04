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
import { Skeleton } from "@/components/ui/skeleton";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  longDescription: string;
  url: string;
  images: string[];
  demoUrl: string;
  readmeContent: string;
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
        const readme = await getReadme("AlexMist23", repository.name);
        repository.readmeContent = readme?.content || "";
        setRepo(repository);
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container max-w-4xl p-4 mx-auto space-y-4">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-full h-64" />
        <div className="flex space-x-2">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  if (!repo) {
    notFound();
  }

  return (
    <Card className="container max-w-4xl p-0 md:p-4 mx-auto overflow-hidden border-none shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
          {repo.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground sm:text-base">
          {repo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {repo.images.map((img: string, i: number) => (
              <CarouselItem key={i} className="pl-0">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <Image
                    src={`/images/repos/${img}`}
                    alt={`${repo.name} screenshot ${i + 1}`}
                    fill
                    objectFit="cover
                    "
                    className="object-cover transition-transform duration-300 ease-in-out rounded-lg hover:scale-105"
                    priority
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="flex flex-col gap-4 p-6 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
          {repo.demoUrl && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={repo.demoUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            </Button>
          )}
        </div>
        <div className="px-6">
          <h2 className="text-xl font-semibold text-primary">Description</h2>
        </div>
        <div className="px-4 overflow-auto rounded-lg max-h-160">
          <MarkdownRenderer markdown={repo.readmeContent} />
        </div>
      </CardContent>
    </Card>
  );
}
