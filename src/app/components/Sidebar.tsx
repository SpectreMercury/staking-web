/* eslint-disable @next/next/no-img-element */
"use client"

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export default function Sidebar() {
  return (
    <>
      <div className="w-64 shrink-0" />
      
      <aside className="fixed left-0 top-0 z-30 w-64 border-r min-h-screen bg-background">
        <div className="p-6 flex justify-center border-b">
          <img 
            src="https://cdn.jsdelivr.net/gh/HashkeyHSK/Brand-Kit@main/Black%20HashKey%20Group.png" 
            alt="HashKey Logo" 
            className="w-32 h-auto" 
          />
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}