"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Shield, Flame, Heart, Radio, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CADLandingPage() {
  const router = useRouter();

  const departments = [
    {
      id: "police",
      name: "Victoria Police",
      description: "Law enforcement and emergency response",
      icon: Shield,
      color: "from-blue-600 to-indigo-600",
      borderColor: "border-blue-500/50",
      hoverColor: "hover:border-blue-400",
      route: "/dashboard/dispatch/police",
      features: [
        "Emergency call dispatch",
        "Unit management & tracking",
        "Civil records & warrants",
        "Traffic stop logging",
        "Criminal database access"
      ]
    },
    {
      id: "fire",
      name: "Fire & Rescue",
      description: "Fire suppression and rescue operations",
      icon: Flame,
      color: "from-red-600 to-orange-600",
      borderColor: "border-red-500/50",
      hoverColor: "hover:border-red-400",
      route: "/dashboard/dispatch/fire",
      features: [
        "Fire emergency dispatch",
        "Apparatus tracking",
        "Incident command",
        "Hazmat coordination",
        "Rescue operations"
      ]
    },
    {
      id: "ems",
      name: "Ambulance Victoria",
      description: "Emergency medical services",
      icon: Heart,
      color: "from-green-600 to-emerald-600",
      borderColor: "border-green-500/50",
      hoverColor: "hover:border-green-400",
      route: "/dashboard/dispatch/ems",
      features: [
        "Medical emergency dispatch",
        "MICA unit coordination",
        "Patient tracking",
        "Hospital routing",
        "Code response management"
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="w-12 h-12 text-indigo-500" />
            <h1 className="text-4xl font-bold text-white">
              Dispatch CAD System
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Select your department to access dispatch operations
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Choose the emergency service you're dispatching for
          </p>
        </motion.div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  isPressable
                  onPress={() => router.push(dept.route)}
                  className={`border-2 ${dept.borderColor} ${dept.hoverColor} transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm h-full`}
                >
                  <CardHeader className={`bg-gradient-to-br ${dept.color} p-6`}>
                    <div className="flex flex-col items-center text-center w-full gap-3">
                      <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {dept.name}
                        </h2>
                        <p className="text-white/80 text-sm mt-1">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Features
                        </h3>
                        <ul className="space-y-2">
                          {dept.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        color="primary"
                        variant="flat"
                        endContent={<ArrowRight className="w-4 h-4" />}
                        className="w-full mt-4"
                        size="lg"
                        onPress={() => router.push(dept.route)}
                      >
                        Enter {dept.name} CAD
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Card className="border border-gray-800 bg-gray-900/50 max-w-2xl mx-auto">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <Radio className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    About CAD System
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The Computer-Aided Dispatch system provides real-time emergency call management, 
                    unit tracking, and coordination tools for all emergency services. Each department 
                    has dedicated features tailored to their specific operational needs while maintaining 
                    seamless inter-agency communication capabilities.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
