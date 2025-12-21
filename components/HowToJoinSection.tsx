"use client";

import { Card, CardBody } from "@nextui-org/react";

const steps = [
  {
    number: "01",
    title: "Join Discord",
    description: "Connect with our community and get familiar with the server",
  },
  {
    number: "02",
    title: "Read the Rules",
    description: "Understand our roleplay guidelines and community standards",
  },
  {
    number: "03",
    title: "Submit Application",
    description: "Fill out your whitelist application with your character backstory",
  },
  {
    number: "04",
    title: "Start Roleplaying",
    description: "Once approved, jump in and begin your roleplay journey",
  },
];

export function HowToJoinSection() {
  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          How to Join
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500 transition-all duration-300"
            >
              <CardBody className="p-6">
                <div className="text-5xl font-bold text-indigo-500/30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {step.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
