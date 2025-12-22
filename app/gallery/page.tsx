"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Chip, Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { X, Download, Share2, Calendar, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const categories = ["All", "Police", "Fire", "EMS", "Civilian", "Events", "Training"];

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071",
    title: "Police Traffic Stop",
    category: "Police",
    date: "Dec 20, 2024",
    description: "Officers conducting a routine traffic stop on the highway",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070",
    title: "EMS Response",
    category: "EMS",
    date: "Dec 19, 2024",
    description: "Emergency medical services responding to a critical call",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=2084",
    title: "Fire Department Training",
    category: "Fire",
    date: "Dec 18, 2024",
    description: "Fire department conducting live fire training exercises",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070",
    title: "Downtown Business District",
    category: "Civilian",
    date: "Dec 17, 2024",
    description: "Civilians conducting business in the bustling downtown area",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1573152143286-0c422b4d2175?q=80&w=2032",
    title: "Department Academy",
    category: "Training",
    date: "Dec 16, 2024",
    description: "New recruits participating in academy training programs",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    title: "Community Car Meet",
    category: "Events",
    date: "Dec 15, 2024",
    description: "Monthly community car meet bringing players together",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070",
    title: "Patrol Unit Response",
    category: "Police",
    date: "Dec 14, 2024",
    description: "Police patrol units responding to a priority call",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1587573089551-e825be8624c3?q=80&w=2070",
    title: "Medical Emergency",
    category: "EMS",
    date: "Dec 13, 2024",
    description: "EMS team providing critical medical assistance",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2080",
    title: "Structure Fire Response",
    category: "Fire",
    date: "Dec 12, 2024",
    description: "Firefighters battling a major structure fire downtown",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070",
    title: "Street Racing Bust",
    category: "Police",
    date: "Dec 11, 2024",
    description: "Officers shutting down illegal street racing activity",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070",
    title: "Business Roleplay",
    category: "Civilian",
    date: "Dec 10, 2024",
    description: "Players conducting business deals and negotiations",
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070",
    title: "Server Anniversary Event",
    category: "Events",
    date: "Dec 9, 2024",
    description: "Community celebrating the server's anniversary milestone",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openImage = (image: typeof galleryImages[0]) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Community <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Gallery</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore screenshots and moments captured by our amazing roleplay community
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Chip
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                size="lg"
              >
                {category}
              </Chip>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group cursor-pointer"
                    isPressable
                    onPress={() => openImage(image)}
                  >
                    <CardBody className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <Chip
                            size="sm"
                            className="bg-purple-600/90 text-white font-semibold"
                            startContent={<Tag className="w-3 h-3" />}
                          >
                            {image.category}
                          </Chip>
                        </div>
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-lg font-bold text-white mb-2">
                            {image.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Calendar className="w-3 h-3" />
                            {image.date}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">No images found in this category</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size="5xl"
        classNames={{
          base: "bg-gray-900 border border-gray-800",
          closeButton: "hover:bg-gray-800 text-white",
        }}
      >
        <ModalContent>
          {selectedImage && (
            <ModalBody className="p-0">
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedImage.title}
                      </h2>
                      <p className="text-gray-300 mb-3">
                        {selectedImage.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {selectedImage.date}
                        </div>
                        <Chip size="sm" className="bg-purple-600/90 text-white">
                          {selectedImage.category}
                        </Chip>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="flat"
                        className="bg-gray-800 hover:bg-gray-700"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="flat"
                        className="bg-gray-800 hover:bg-gray-700"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <Footer />
    </main>
  );
}
