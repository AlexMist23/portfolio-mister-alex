"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  image: string;
}

export default function PortfolioLanding() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await fetch("/api/github-repositories");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch repositories");
        }
        const data = await response.json();
        setRepositories(data);
        setIsLoading(false);
      } catch (err) {
        setError(`Error fetching repositories: ${(err as Error).message}`);
        setIsLoading(false);
      }
    }

    fetchRepositories();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col items-center mb-8 md:flex-row">
        <Avatar className="w-32 h-32 mb-4 md:w-48 md:h-48 md:mb-0 md:mr-8">
          <AvatarImage src="/your-photo.jpg" alt="Aleksander Misterkiewicz" />
          <AvatarFallback>YN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="mb-2 text-3xl font-bold">Your Name</h1>
          <p className="mb-4 text-xl">
            Full-stack Developer | Open Source Enthusiast
          </p>
          <Button asChild>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub Profile
            </a>
          </Button>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold">My Projects</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {repositories.map((repo) => (
          <Card key={repo.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <CardDescription>
                {repo.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="relative mb-4 aspect-video">
                <Image
                  src={`/images/repos/${repo.image}`}
                  alt={repo.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <Button asChild className="w-full">
                <Link href={`/projects/${repo.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
