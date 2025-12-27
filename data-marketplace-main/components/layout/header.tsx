"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Menu,
  Database,
  Settings,
  LogOut,
  Plus,
  Activity,
  Briefcase,
  MessageCircle,
  User,
  Wrench,
  Shield,
  BarChart3,
} from "lucide-react";
import { useWorkbench } from "@/lib/workbench-context";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useWorkbench();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold">
                Data Marketplace
              </div>
              <div className="text-xs text-muted-foreground">What will you discover today?</div>
            </div>
          </Link>
        </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Main Navigation - Right Side */}
          <TooltipProvider>
            <nav className="hidden lg:flex items-center space-x-1">
              <Button
                variant="ghost"
                asChild
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/" className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                asChild 
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/marketplace'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/marketplace" className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Browse Data</span>
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                asChild 
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/tools'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/tools" className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4" />
                  <span>Browse Tools</span>
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                asChild 
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/policies'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/policies" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Browse Policies</span>
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                asChild 
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/collections'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/collections" className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Browse Collections</span>
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                asChild 
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/insights'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/insights" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Browse Insights</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className={`relative px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
                  pathname === '/workbench'
                    ? 'bg-blue-700 text-white shadow-sm hover:bg-blue-600'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Link href="/workbench" className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>My Work Bench</span>
                </Link>
              </Button>
            </nav>
          </TooltipProvider>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* User Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent transition-all duration-200 hover:shadow-md">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>User menu and settings</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="w-56 bg-white border border-border shadow-xl z-[100]" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Data Analyst • Gaming Analytics
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-all duration-200">
                <Link href="/dashboard" className="flex items-center w-full">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>My Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-all duration-200">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-6">

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-2">
                    <Link
                      href="/"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Chat</span>
                    </Link>
                    <Link
                      href="/marketplace"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/marketplace' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Database className="h-5 w-5" />
                      <span>Browse Data</span>
                    </Link>
                    <Link
                      href="/tools"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/tools' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Wrench className="h-5 w-5" />
                      <span>Browse Tools</span>
                    </Link>
                    <Link
                      href="/policies"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/policies' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Browse Policies</span>
                    </Link>
                    <Link
                      href="/collections"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/collections' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Database className="h-5 w-5" />
                      <span>Browse Collections</span>
                    </Link>
                    <Link
                      href="/insights"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/insights' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>Browse Insights</span>
                    </Link>
                    <Link
                      href="/workbench"
                      className={`flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-md transition-all duration-200 hover:shadow-sm ${
                        pathname === '/workbench' 
                          ? 'bg-blue-700 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Briefcase className="h-5 w-5" />
                      <span>My Work Bench</span>
                    </Link>
                  </nav>

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button 
                    className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-sm" 
                    variant="outline" 
                    asChild
                  >
                    <Link href="/requests">
                      <Plus className="mr-2 h-4 w-4" />
                      Request Data Access
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}