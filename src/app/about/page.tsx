import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="px-4 py-8 mx-auto xl:container">
      <h1 className="mb-8 text-4xl font-bold">About Me</h1>
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
          <h2 className="mb-2 text-2xl font-semibold">Skills</h2>
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
