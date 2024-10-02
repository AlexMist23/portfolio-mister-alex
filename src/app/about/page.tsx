import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="xl:container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Me</h1>
      <Card>
        <CardHeader>
          <CardTitle>Misterkiewicz Aleksander</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            I&apos;m a passionate full-stack developer with experience in React,
            Node.js, and TypeScript. I love building scalable web applications
            and solving complex problems.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Skills</h2>
          <ul className="list-disc list-inside">
            <li>JavaScript / TypeScript</li>
            <li>React / Next.js</li>
            <li>Node.js / Express</li>
            <li>SQL / NoSQL Databases</li>
            <li>AWS / Azure</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
