import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";

const features = [
  {
    tag: "React 19",
    title: "Server & Client Components",
    description:
      "Fully compatible with React 19 architecture, actions, suspense, and modern hook paradigms.",
  },
  {
    tag: "Next.js 15",
    title: "App Router Optimized",
    description:
      "Engineered with layouts, nested routes, streaming SSR, and edge runtime support out of the box.",
  },
  {
    tag: "Tailwind CSS",
    title: "Theme & Dark Mode",
    description:
      "Tailwind-styled utility design system with seamless light and dark color schemes.",
  },
  {
    tag: "TypeScript",
    title: "100% Type-Safe",
    description:
      "Strict typing on all props, components, and hooks with full autocompletion in your IDE.",
  },
  {
    tag: "Modular",
    title: "Composable Primitives",
    description:
      "Easy-to-customize UI primitives including Button, Card, Badge, and Input components.",
  },
  {
    tag: "Git Integrated",
    title: "Continuous Delivery",
    description:
      "Pre-configured and connected directly to GitHub for automated branch deploys.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Component Showcase
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Everything You Need To Build Fast
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            A comprehensive suite of production-ready React components and Next.js foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:-translate-y-1 transition-all">
              <CardHeader>
                <div className="mb-2">
                  <Badge variant="secondary">{feature.tag}</Badge>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-12 bg-blue-600 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
