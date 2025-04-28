"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  PiggyBank,
  Receipt,
  Target,
  BarChart3,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  // State to store user's name input
  const [name, setName] = useState("");
  // State to track if the name is set
  const [isNameSet, setIsNameSet] = useState(false);
  // State to track if the page is still loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve stored name from local storage if available
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
      setIsNameSet(true);
    }
    setIsLoading(false);
  }, []);

  // Handle name submission and store it in local storage
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
      setIsNameSet(true);
    }
  };

  // Feature list with icons and descriptions
  const features = [
    {
      icon: Wallet,
      title: "Smart Budgeting",
      description: "Set and manage your budgets with intelligent insights",
      href: "/budget",
    },
    {
      icon: Receipt,
      title: "Transaction Tracking",
      description: "Log and categorize your expenses effortlessly",
      href: "/transactions",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Understand your spending with intuitive charts",
      href: "/analytics",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Track your financial goals and stay motivated",
      href: "/dashboard",
    },
  ];

  // Quick start guide steps
  const quickStartSteps = [
    {
      number: "01",
      title: "Set Your Budget",
      description: "Define monthly budgets for different spending categories",
    },
    {
      number: "02",
      title: "Track Expenses",
      description: "Log your daily transactions to stay on top of spending",
    },
    {
      number: "03",
      title: "Monitor Progress",
      description: "View insights and adjust your budget as needed",
    },
  ];

  // Show loading state while checking local storage
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-4xl">
        <PiggyBank className="h-10 w-10 text-primary mx-5" />
        <span className="font-bold">FinanceTrack</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="flex-1 py-12 md:py-24 lg:py-12 bg-gradient-to-b from-background to-muted">
        {!isNameSet ? (
          // If user has not entered their name, show input form
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                  Take Control of Your Finances
                </h1>
                <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 mx-auto">
                  FinanceTrack helps you manage your money smarter with powerful
                  budgeting tools and insightful analytics.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <Input
                    placeholder="Enter your name to get started"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center"
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Start Your Financial Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          // If user has entered their name, show features and quick start guide
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Welcome back, {name}!
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
                  Let&apos;s continue managing your finances together.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Link key={feature.title} href={feature.href}>
                      <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardHeader>
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">
                              {feature.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Quick start guide */}
              <div className="w-full">
                <h2 className="text-2xl font-bold text-center mb-8">
                  Quick Start Guide
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {quickStartSteps.map((step) => (
                    <Card
                      key={step.number}
                      className="relative overflow-hidden"
                    >
                      <div className="absolute right-4 top-4 text-6xl font-bold text-muted-foreground/20">
                        {step.number}
                      </div>
                      <CardHeader>
                        <CardTitle>{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}