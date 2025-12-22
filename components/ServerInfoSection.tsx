"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";
import { Server, Users as UsersIcon, Lock } from "lucide-react";

export function ServerInfoSection() {
  return (
    <section id="server-info" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          Server Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-8">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-600/20 rounded-full">
                  <Server className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">
                Server Status
              </h3>
              <Chip color="success" variant="flat" size="lg">
                Online
              </Chip>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-8">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-blue-600/20 rounded-full">
                  <UsersIcon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">
                Discord Members
              </h3>
              <p className="text-3xl font-bold text-white">1,247</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-8">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-purple-600/20 rounded-full">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">
                Server Type
              </h3>
              <Chip color="secondary" variant="flat" size="lg">
                Whitelisted
              </Chip>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
