"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { Shield, Heart, Users, Target, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const departments = [
  {
    icon: Shield,
    title: "Police",
    description: "Join the force and maintain law and order. Realistic police procedures and training provided.",
    dashboardLink: "/dashboard/police",
  },
  {
    icon: Heart,
    title: "Fire & EMS",
    description: "Save lives as a firefighter or paramedic. Experience realistic emergency medical services.",
    dashboardLink: "/dashboard/ems",
    dashboardLink2: "/dashboard/fire",
  },
  {
    icon: Users,
    title: "Civilian",
    description: "Live your life as a civilian. Own businesses, pursue careers, and build your story.",
    dashboardLink: "/dashboard/civilian",
  },
  {
    icon: Target,
    title: "Criminal / Gangs",
    description: "Choose the criminal path. Form gangs, build empires, and navigate the underworld.",
    dashboardLink: "/dashboard/criminal",
  },
];

export function DepartmentsSection() {
  const router = useRouter();

  return (
    <section id="departments" className="py-20 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          Departments & Playstyles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500 transition-all duration-300 hover:scale-105"
              >
                <CardBody className="text-center p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-indigo-600/20 rounded-lg">
                      <Icon className="w-8 h-8 text-indigo-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {dept.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {dept.description}
                  </p>
                  
                  {dept.dashboardLink && (
                    <div className="flex flex-col gap-2 mt-4">
                      {dept.title === "Fire & EMS" ? (
                        <>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            endContent={<ArrowRight className="w-4 h-4" />}
                            onPress={() => router.push(dept.dashboardLink)}
                          >
                            EMS Dashboard
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            endContent={<ArrowRight className="w-4 h-4" />}
                            onPress={() => router.push(dept.dashboardLink2!)}
                          >
                            Fire Dashboard
                          </Button>
                        </>
                      ) : dept.title === "Civilian" ? (
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          endContent={<ArrowRight className="w-4 h-4" />}
                          onPress={() => router.push(dept.dashboardLink)}
                        >
                          Civilian Dashboard
                        </Button>
                      ) : dept.title === "Criminal / Gangs" ? (
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          endContent={<ArrowRight className="w-4 h-4" />}
                          onPress={() => router.push(dept.dashboardLink)}
                        >
                          Criminal Dashboard
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          endContent={<ArrowRight className="w-4 h-4" />}
                          onPress={() => router.push(dept.dashboardLink)}
                        >
                          View Dashboard
                        </Button>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

