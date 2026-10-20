import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />

        {/* Interactive UI Component Playground Section */}
        <section id="components" className="py-20 max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="success" className="mb-3">
              Interactive Library
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Installed React Components
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Test and view the core reusable components built into your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons & Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Button & Badge Variants</CardTitle>
                <CardDescription>
                  Customizable button styles and contextual badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="danger" size="sm">Danger</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Form controls */}
            <Card>
              <CardHeader>
                <CardTitle>Input & Form Controls</CardTitle>
                <CardDescription>
                  Fully styled responsive inputs and actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Enter your email address..." />
                <div className="flex gap-2">
                  <Input placeholder="Search components..." />
                  <Button variant="primary">Search</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
