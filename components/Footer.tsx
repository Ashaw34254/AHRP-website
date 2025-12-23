"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  MessageCircle,
  Twitter,
  Youtube,
  Instagram,
  Heart
} from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/#about" },
    { name: "Features", href: "/#features" },
    { name: "Departments", href: "/#departments" },
    { name: "Updates", href: "/#updates" },
  ],
  community: [
    { name: "Discord Server", href: "https://discord.gg/ahrp", external: true },
    { name: "Application", href: "/apply" },
    { name: "Staff Team", href: "/staff" },
    { name: "Rules & Guidelines", href: "/rules" },
  ],
  resources: [
    { name: "FAQ", href: "/#faq" },
    { name: "How to Join", href: "/#join" },
    { name: "Server Info", href: "/#server-info" },
    { name: "Support", href: "/support" },
  ],
};

const socialLinks = [
  { icon: MessageCircle, href: "https://discord.gg/ahrp", name: "Discord", color: "hover:text-indigo-400" },
  { icon: Twitter, href: "#", name: "Twitter", color: "hover:text-blue-400" },
  { icon: Youtube, href: "#", name: "YouTube", color: "hover:text-red-500" },
  { icon: Instagram, href: "#", name: "Instagram", color: "hover:text-pink-400" },
];

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-950 to-black border-t border-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="Aurora Horizon RP Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                    Aurora Horizon RP
                  </h3>
                  <p className="text-xs text-gray-500">Premium Roleplay</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                A next-generation FiveM roleplay community dedicated to realistic, 
                story-driven experiences with professional staff and custom systems.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Australia / New Zealand</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <a href="mailto:contact@ahrp.com" className="hover:text-purple-400 transition-colors">
                    contact@ahrp.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm block"
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-500 text-sm text-center md:text-left"
          >
            <p>
              © {new Date().getFullYear()} Aurora Horizon Roleplay. Made with{" "}
              <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> by the AHRP Team.
            </p>
            <p className="mt-1">
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
              {" • "}
              <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 ${social.color} hover:border-purple-500/50 transition-all hover:scale-110`}
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </motion.div>
        </div>

        {/* Server Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">Server Online</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
