import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  longDescription: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: "1",
    title: "Project 1",
    description: "A brief description of Project 1",
    repoUrl: "https://github.com/yourusername/project1",
    longDescription:
      "A more detailed description of Project 1, including its features, challenges, and outcomes.",
    technologies: ["React", "Node.js", "MongoDB"],
  },
  // Add more projects as needed
];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="xl:container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{project.longDescription}</p>
          <h3 className="text-lg font-semibold mb-2">Technologies Used:</h3>
          <ul className="list-disc list-inside">
            {project.technologies.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Link
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
