import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Project 1",
    description: "A brief description of Project 1",
    repoUrl: "https://github.com/yourusername/project1",
  },
  {
    id: "2",
    title: "Project 2",
    description: "A brief description of Project 2",
    repoUrl: "https://github.com/yourusername/project2",
  },
  // Add more projects as needed
];

export default function Home() {
  return (
    <div className="xl:container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Link href={`/projects/${project.id}`}>
                <Button variant="outline">Learn More</Button>
              </Link>
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <GitHubLogoIcon className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
