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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio"; // Make sure to import AspectRatio

async function getRepository(id: string) {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const url = `${protocol}://${host}/api/github-repositories?id=${id}`;

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
    <div className="container max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-background">
      <Card className="border shadow-lg border-muted-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {repo.name}
          </CardTitle>
          <CardDescription className="text-base text-muted">
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
          <p className="mt-4 text-lg leading-relaxed text-foreground">
            {repo.longDescription}
          </p>
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
        </CardContent>
      </Card>
    </div>
  );
}
