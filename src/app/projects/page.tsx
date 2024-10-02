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
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepositories(data);
        setIsLoading(false);
      } catch (err) {
        setError(`Error fetching repositories ${err}`);
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center mb-8">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0 md:mr-8">
          <AvatarImage src="/your-photo.jpg" alt="Aleksander Misterkiewicz" />
          <AvatarFallback>YN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Name</h1>
          <p className="text-xl mb-4">
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

      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {repositories.map((repo) => (
          <Card key={repo.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <CardDescription>
                {repo.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video relative mb-4">
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
