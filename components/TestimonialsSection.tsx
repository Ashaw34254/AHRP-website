"use client";

import { Card, CardBody, Avatar } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Officer Johnson",
    role: "Police Department",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Johnson",
    content: "The CAD system is incredibly realistic. It feels like I'm using actual dispatch software. The level of immersion is unmatched.",
    rating: 5,
  },
  {
    name: "Dr. Sarah Mitchell",
    role: "EMS Department",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "Best EMS roleplay experience I've had. The staff are supportive, and the systems are intuitive and professional.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Civilian",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    content: "The economy is well-balanced, and there's always something to do. The community is welcoming and active.",
    rating: 5,
  },
  {
    name: "Captain Rodriguez",
    role: "Fire Department",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rodriguez",
    content: "Professional environment with realistic fire operations. The training program is thorough and well-organized.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            What Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Community</span> Says
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join hundreds of satisfied players in our thriving roleplay community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
                <CardBody className="p-6">
                  <Quote className="w-8 h-8 text-purple-400/50 mb-4" />
                  
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar
                      src={testimonial.avatar}
                      className="w-12 h-12"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-purple-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
