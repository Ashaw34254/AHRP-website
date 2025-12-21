import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              Aurora Horizon RP
            </h3>
            <p className="text-gray-400 text-sm">
              A next-generation FiveM roleplay experience focused on realistic, 
              immersive gameplay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Rules
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Applications
                </Link>
              </li>
              <li>
                <a 
                  href="https://discord.gg/ahrp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/departments" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Departments
                </Link>
              </li>
              <li>
                <Link href="/staff" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Staff Team
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Aurora Horizon Roleplay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
