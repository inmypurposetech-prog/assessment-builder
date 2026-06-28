import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "CAPS and IEB aligned",
    body: "Choose DBE CAPS or IEB so your paper matches your school’s curriculum.",
  },
  {
    title: "Maths and Life Sciences",
    body: "Start with the subjects you teach most — more subjects will follow.",
  },
  {
    title: "Marking memo friendly",
    body: "We use plain language educators expect, not confusing tech jargon.",
  },
  {
    title: "Step-by-step wizard",
    body: "One clear decision per screen, with your work saved as you go.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <p className="text-2xl font-bold text-primary">AssessMate</p>
          <nav className="flex flex-wrap gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign up free</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12">
        <section className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Assessment planning built for South African educators
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Create structured tests and exams for Mathematics and Life Sciences.
            Large text, simple steps, and language you can trust — whether you
            teach CAPS or IEB.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button className="w-full sm:w-auto">Get started</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" className="w-full sm:w-auto">
                I already have an account
              </Button>
            </Link>
          </div>
        </section>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-3xl font-semibold">
            Why educators use AssessMate
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature.title}>
                <Card className="h-full">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.body}</CardDescription>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-white py-8 text-center text-base text-muted-foreground">
        Made for teachers in their 50s and beyond — readable, calm, and clear.
      </footer>
    </div>
  );
}
