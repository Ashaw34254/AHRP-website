"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { Server, Users as UsersIcon, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function ServerInfoSection() {
  const SERVER_IP = "play.aurorahorizonrp.com"; // change if needed

  return (
    <section id="server-info" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Server Information
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Live server details and connection information for Aurora Horizon RP.
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Server Status */}
          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800 hover:border-green-500/40 transition-all">
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

          {/* Discord Members */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <CardBody className="text-center p-8">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-blue-600/20 rounded-full">
                  <UsersIcon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">
                Discord Members
              </h3>
              <p className="text-3xl font-bold text-white">23</p>
              <p className="text-sm text-gray-500 mt-1">
                Growing community
              </p>
            </CardBody>
          </Card>

          {/* Server Type */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800 hover:border-purple-500/40 transition-all">
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
              <p className="text-sm text-gray-500 mt-2">
                Quality-focused roleplay
              </p>
            </CardBody>
          </Card>

          {/* Server IP */}
          <Card className="bg-gradient-to-br from-indigo-900/30 to-gray-900/50 border border-gray-800 hover:border-indigo-500/40 transition-all">
            <CardBody className="text-center p-8">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-indigo-600/20 rounded-full">
                  <Globe className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">
                Server IP
              </h3>
              <p className="text-white font-mono text-lg select-all">
                {SERVER_IP}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Connect via FiveM
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
