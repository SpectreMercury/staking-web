/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Sidebar Spacer */}
      <div className="hidden md:block w-64 shrink-0" />
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-40 w-64 border-r h-full bg-background transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
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
              onClick={() => setIsOpen(false)}
            >
              <Link href="/" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}