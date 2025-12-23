"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@nextui-org/react";
import { ChevronDown, LogOut, LayoutDashboard, Shield, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Extend session type to include role
interface ExtendedSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function Header() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Departments", href: "/#departments" },
    { name: "Features", href: "/#features" },
    { name: "Join", href: "/#join" },
    { name: "Server Info", href: "/#server-info" },
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className={`transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-500/10"
          : "bg-black/60 backdrop-blur-md border-b border-gray-800"
      }`}
      height="4.5rem"
    >
      {/* Logo/Brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src="/logo.png"
                alt="Aurora Horizon RP Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Aurora Horizon
              </span>
              <span className="text-xs text-gray-400 font-medium hidden sm:block">Roleplay Community</span>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden lg:flex gap-8" justify="center">
        <NavbarItem>
          <Link 
            href="/#about" 
            className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 inline-block"
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/#departments" 
            className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 inline-block"
          >
            Departments
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/#features" 
            className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 inline-block"
          >
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Badge content="New" color="secondary" size="sm" className="hidden xl:block">
            <Link 
              href="/#join" 
              className="text-gray-300 hover:text-white transition-all duration-200 font-medium hover:scale-105 inline-block"
            >
              Join
            </Link>
          </Badge>
        </NavbarItem>
      </NavbarContent>

      {/* Right side - Auth buttons or user menu */}
      <NavbarContent justify="end">
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={session.user?.name || "User"}
                  size="sm"
                  src={session.user?.image || undefined}
                />
                <span className="text-white hidden md:block">{session.user?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                textValue="Profile"
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="dashboard"
                startContent={<LayoutDashboard className="w-4 h-4" />}
                href="/dashboard"
                textValue="Dashboard"
              >
                Dashboard
              </DropdownItem>
              {session.user?.role === "admin" ? (
                <DropdownItem
                  key="admin"
                  startContent={<Shield className="w-4 h-4" />}
                  href="/admin"
                  textValue="Admin Panel"
                >
                  Admin Panel
                </DropdownItem>
              ) : null}
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut className="w-4 h-4" />}
                onClick={() => signOut({ callbackUrl: "/" })}
                textValue="Sign Out"
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-3">
            <NavbarItem>
              <Button
                as="a"
                href="https://discord.gg/ahrp"
                target="_blank"
                variant="light"
                className="text-gray-300 hover:text-white font-medium hidden md:flex"
                startContent={<Users className="w-4 h-4" />}
              >
                Discord
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                onClick={() => signIn("discord")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
                endContent={<Sparkles className="w-4 h-4" />}
              >
                Get Started
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/95 backdrop-blur-md pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              href={item.href}
              className="w-full text-white text-lg py-2 block hover:text-indigo-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {!session && (
          <NavbarMenuItem>
            <Button
              fullWidth
              color="primary"
              variant="shadow"
              onClick={() => {
                signIn("discord");
                setIsMenuOpen(false);
              }}
              className="mt-4"
            >
              Sign In / Get Started
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
