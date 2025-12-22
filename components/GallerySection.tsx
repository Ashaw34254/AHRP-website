"use client";

import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { Play, Image as ImageIcon } from "lucide-react";

const galleryItems = [
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071",
    title: "Police Operations",
    description: "Professional law enforcement in action",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070",
    title: "Emergency Medical Services",
    description: "Life-saving EMS responses",
  },
  {
    type: "video",
    url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=2084",
    title: "Fire Department Response",
    description: "Firefighters in critical situations",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070",
    title: "City Life & Business",
    description: "Thriving civilian roleplay",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1573152143286-0c422b4d2175?q=80&w=2032",
    title: "Department Training",
    description: "Professional training programs",
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    title: "Community Events",
    description: "Server-wide special events",
  },
];

export function GallerySection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            See AHRP in <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Action</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore screenshots and videos from our immersive roleplay community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                <CardBody className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    {/* Image */}
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Play button for videos */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-purple-600/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Type indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-2">
                        {item.type === "video" ? (
                          <Play className="w-4 h-4 text-purple-400" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-xs text-white uppercase font-semibold">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a href="/gallery">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70">
              View Full Gallery
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
