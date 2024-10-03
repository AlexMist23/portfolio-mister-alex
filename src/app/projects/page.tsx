"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  ExternalLinkIcon,
  CodeIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;
  createdAt: string;
}

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "REST APIs",
  "AWS",
  "Docker",
  "CI/CD",
  "Jest",
  "React Testing Library",
];

function RepositoriesList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    async function fetchRepositories() {
      const response = await fetch("/api/github-repositories");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch repositories");
      }
      const data = await response.json();
      setRepositories(data);
      console.log(data);
    }
    fetchRepositories();
  }, []);

  return (
    <div className="space-y-8">
      {repositories.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden transition-shadow duration-300 group hover:shadow-lg">
            <div className="md:flex">
              <div className="relative h-48 md:h-auto md:w-1/3">
                <Image
                  src={`/images/repos/${repo.images[0]}`}
                  alt={repo.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 border-r-2 group-hover:scale-105 borderr-muted"
                />
              </div>
              <div className="flex flex-col justify-between p-6 md:w-2/3">
                <div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold">
                      {repo.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm text-muted-foreground">
                      {repo.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center mb-4 text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2" />
                    Created on: {new Date(repo.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <CardFooter className="flex items-center justify-between p-0">
                  <div className="flex space-x-2">
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CodeIcon className="mr-2" />
                        Code
                      </a>
                    </Button>
                    {repo.demoUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={repo.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon className="mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/projects/${repo.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function RepositoriesLoadingFallback() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="md:flex">
            <Skeleton className="h-48 md:h-auto md:w-1/3" />
            <div className="flex flex-col justify-between p-6 md:w-2/3">
              <div>
                <Skeleton className="w-2/3 h-8 mb-4" />
                <Skeleton className="w-full h-4 mb-4" />
                <div className="flex flex-wrap gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="w-16 h-6" />
                  ))}
                </div>
                <Skeleton className="w-1/2 h-4 mb-4" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Skeleton className="w-20 h-9" />
                  <Skeleton className="w-20 h-9" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong:</h2>
      <p className="mb-4 text-red-500">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="p-8 mx-auto xl:container">
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8 md:flex-row md:items-start"
        >
          <Avatar className="w-32 h-32 mb-4 shadow-md md:w-48 md:h-48 md:mb-0 md:mr-8 shadow-muted">
            <AvatarImage
              src="/images/am-main-img.webp"
              alt="Aleksander Misterkiewicz"
            />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text">
              Aleksander Misterkiewicz
            </h1>
            <p className="mb-4 text-xl text-muted-foreground">
              Full-stack Developer
            </p>
            <div className="flex mb-6 space-x-4">
              <Button asChild variant="outline">
                <a
                  href="https://github.com/AlexMist23"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubLogoIcon className="mr-2" />
                  GitHub Profile
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://www.linkedin.com/in/aleksandermst/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInLogoIcon className="mr-2" />
                  LinkedIn Profile
                </a>
              </Button>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed">
              Detail-oriented quality assurance tester transitioning to
              front-end development. Skilled in software testing, development,
              and design with a focus on Python and JavaScript. Seeking
              opportunities to apply analytical problem-solving skills and
              technical expertise in a junior front-end role.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Skills & Technologies</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {skill}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">Featured Projects</h2>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
        >
          <Suspense fallback={<RepositoriesLoadingFallback />}>
            <RepositoriesList />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}
