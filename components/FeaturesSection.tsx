"use client";

import { Card, CardBody } from "@nextui-org/react";
import { Award, Code, Ambulance, DollarSign, Globe } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Experienced Staff Team",
    description: "Dedicated and fair staff with years of roleplay experience",
  },
  {
    icon: Code,
    title: "Custom Scripts & Systems",
    description: "Unique custom-built features and mechanics for immersive gameplay",
  },
  {
    icon: Ambulance,
    title: "Realistic Emergency Services",
    description: "Fully functional police, fire, and EMS departments with proper protocols",
  },
  {
    icon: DollarSign,
    title: "Balanced Economy",
    description: "Fair and balanced economy system ensuring long-term engagement",
  },
  {
    icon: Globe,
    title: "AU/NZ-Friendly Community",
    description: "Optimized for Australian and New Zealand time zones with active players",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          Why Choose AHRP
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 hover:border-purple-500 transition-all duration-300"
              >
                <CardBody className="p-6">
                  <div className="mb-4">
                    <div className="p-3 bg-purple-600/20 rounded-lg inline-block">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
