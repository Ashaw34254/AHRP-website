"use client";

import { useState } from "react";
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
} from "@nextui-org/react";
import { ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";

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
      className="bg-black/80 backdrop-blur-md border-b border-gray-800"
    >
      {/* Logo/Brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              AHRP
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link href="/#about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/#departments" className="text-gray-300 hover:text-white transition-colors">
            Departments
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/#join" className="text-gray-300 hover:text-white transition-colors">
            Join
          </Link>
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
          <div className="flex items-center gap-2">
            <NavbarItem className="hidden md:flex">
              <Button
                variant="light"
                onClick={() => signIn("discord")}
                className="text-white"
              >
                Sign In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="primary"
                variant="shadow"
                onClick={() => signIn("discord")}
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
