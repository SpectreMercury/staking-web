"use client"

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StakePanel from "./components/StakePanel";

export default function Home() {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="container">
          <Dashboard />          
          <div className="grid gap-4 md:grid-cols-2 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Stake with Confidence</CardTitle>
                <CardDescription>
                  Join us to earn rewards and support the future of decentralized networks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New to Staking?</CardTitle>
                <CardDescription>
                  Learn what staking is, its benefits, and how to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/docs" className="flex items-center">
                    Read our docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <StakePanel />
        </div>
      </main>
    </div>
  );
}
