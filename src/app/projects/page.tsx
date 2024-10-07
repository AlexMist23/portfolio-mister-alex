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
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GitHubLogoIcon,
  ExternalLinkIcon,
  CodeIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;
  createdAt: string;
  inDevelopment: boolean;
}
interface SkillsAndTechnologies {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
}
const skillsAndTechnologies: SkillsAndTechnologies = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL"],
  frameworks: ["React", "Node.js", "Next.js", "Django", "Flask"],
  tools: ["Git", "ESLint", "Responsive Design"],
  databases: ["PostgreSQL"],
};

function RepositoryCard({ repo }: { repo: Repository }) {
  return (
    <Card className="w-full overflow-hidden transition-shadow duration-300 group hover:shadow-lg hover:shadow-muted">
      <div className="relative max-h-fit border-b-2">
        <Carousel
          opts={{ loop: true, align: "center" }}
          className="h-full grid bg-muted"
        >
          <CarouselContent className="h-full">
            {repo.images.map((img, i) => (
              <CarouselItem
                key={i}
                className={cn(
                  "h-full flex justify-center items-center",
                  repo.images.length > 2 ? "xl:basis-2/3" : ""
                )}
              >
                <Image
                  src={`${img}`}
                  alt={`${repo.name} - Image ${i + 1}`}
                  width={880}
                  height={240}
                  className="transition-transform duration-300 ease-in-out transform hover:scale-105 rounded-lg shadow-lg shadow-foreground/20 md:m-4"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute z-10 left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute z-10 right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>

      <CardContent className="p-6">
        <CardHeader className="p-0 mb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{repo.name}</CardTitle>
            {repo.inDevelopment && (
              <Badge variant="secondary">In Development</Badge>
            )}
          </div>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            {repo.description || "No description"}
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex items-center mb-4 text-sm text-muted-foreground">
          <CalendarIcon className="mr-2" />
          Created on: {new Date(repo.createdAt).toLocaleDateString()}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-6">
        <div className="flex space-x-2">
          <Button asChild size="sm" variant="outline">
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              <CodeIcon className="mr-2" />
              Code
            </a>
          </Button>
          {repo.demoUrl && (
            <Button asChild size="sm" variant="outline">
              <a href={repo.demoUrl} target="_blank" rel="noopener noreferrer">
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
    </Card>
  );
}
function RepositoriesList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    async function fetchRepositories() {
      const response = await fetch("/api/github/repository-list");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch repositories");
      }
      const data = await response.json();
      setRepositories(data);
    }
    fetchRepositories();
  }, []);

  return (
    <div className="space-y-12">
      {repositories.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <RepositoryCard repo={repo} />
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
    <div className="flex flex-col p-0 mx-auto sm:p-8 xl:container">
      <section className="p-8 mx-auto md:mb-16 sm:p-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-6 items-center"
        >
          <div>
            <Avatar className=" w-60 h-60 shadow-md md:mb-0 md:mr-8 shadow-muted ">
              <AvatarImage
                src="/images/am-main-img.webp"
                alt="Aleksander Misterkiewicz"
              />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text">
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
                  LinkedIn Profile
                </a>
              </Button>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed">
              Detail-oriented quality assurance tester transitioning to
              full-stack development. Skilled in software testing, development,
              and design with a focus on Python and JavaScript. Seeking
              opportunities to apply analytical problem-solving skills and
              technical expertise in a junior full-stack role.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Skills and Technologies Section */}
      <section className="p-8 mb-16 sm:p-0">
        <h2 className="mb-6 text-3xl font-bold">Skills & Technologies</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skillsAndTechnologies).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 text-xl font-semibold capitalize">
                {category}
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {items.map((item: string, index: number) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      {item}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="px-8 mb-6 text-3xl font-bold sm:p-0">
          Featured Projects
        </h2>
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
