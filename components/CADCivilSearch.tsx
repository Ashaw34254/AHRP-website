"use client";

import { Card, CardBody, Input, Button, Spinner } from "@nextui-org/react";
import { Search, User, Car, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Citizen {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string | null;
  stateId: string | null;
  phoneNumber: string | null;
  address: string | null;
  isWanted: boolean;
  isMissing: boolean;
  driversLicense: boolean;
  weaponsPermit: boolean;
  warrants: Array<{
    offense: string;
    bail: number | null;
    isActive: boolean;
  }>;
  vehicles: Array<{
    plate: string;
    model: string;
    color: string;
  }>;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
  year: number | null;
  isStolen: boolean;
  isWanted: boolean;
  owner: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
}

type SearchType = "citizen" | "vehicle";

export function CADCivilSearch() {
  const [searchType, setSearchType] = useState<SearchType>("citizen");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setCitizen(null);
    setVehicle(null);

    try {
      const endpoint = searchType === "citizen" 
        ? `/api/cad/civil/citizen?q=${encodeURIComponent(searchQuery)}`
        : `/api/cad/civil/vehicle?plate=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(endpoint);
      
      if (response.status === 404) {
        setError(`${searchType === "citizen" ? "Citizen" : "Vehicle"} not found`);
        return;
      }

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      
      if (searchType === "citizen") {
        setCitizen(data.citizen);
      } else {
        setVehicle(data.vehicle);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                color={searchType === "citizen" ? "primary" : "default"}
                variant={searchType === "citizen" ? "solid" : "flat"}
                startContent={<User className="w-4 h-4" />}
                onClick={() => {
                  setSearchType("citizen");
                  setSearchQuery("");
                  setCitizen(null);
                  setVehicle(null);
                  setError(null);
                }}
              >
                Citizen
              </Button>
              <Button
                size="sm"
                color={searchType === "vehicle" ? "primary" : "default"}
                variant={searchType === "vehicle" ? "solid" : "flat"}
                startContent={<Car className="w-4 h-4" />}
                onClick={() => {
                  setSearchType("vehicle");
                  setSearchQuery("");
                  setCitizen(null);
                  setVehicle(null);
                  setError(null);
                }}
              >
                Vehicle
              </Button>
            </div>

            <Input
              placeholder={
                searchType === "citizen"
                  ? "Search by name or State ID..."
                  : "Search by license plate..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-1"
            />

            <Button
              color="primary"
              onClick={handleSearch}
              isLoading={loading}
            >
              Search
            </Button>
          </div>
        </CardBody>
      </Card>

      {loading && (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6 flex items-center justify-center">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      )}

      {error && (
        <Card className="bg-red-900/20 border border-red-800">
          <CardBody className="p-6">
            <p className="text-red-400 text-center">{error}</p>
          </CardBody>
        </Card>
      )}

      {citizen && (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {citizen.firstName} {citizen.lastName}
                </h3>
                {citizen.stateId && (
                  <p className="text-sm text-gray-400">State ID: {citizen.stateId}</p>
                )}
              </div>
              <div className="flex gap-2">
                {citizen.isWanted && (
                  <div className="px-3 py-1 bg-red-900/50 border border-red-700 rounded-full">
                    <span className="text-xs font-semibold text-red-400">WANTED</span>
                  </div>
                )}
                {citizen.isMissing && (
                  <div className="px-3 py-1 bg-yellow-900/50 border border-yellow-700 rounded-full">
                    <span className="text-xs font-semibold text-yellow-400">MISSING</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p className="text-white" suppressHydrationWarning>
                  {new Date(citizen.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              {citizen.gender && (
                <div>
                  <p className="text-gray-400">Gender</p>
                  <p className="text-white">{citizen.gender}</p>
                </div>
              )}
              {citizen.phoneNumber && (
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white">{citizen.phoneNumber}</p>
                </div>
              )}
              {citizen.address && (
                <div className="col-span-2">
                  <p className="text-gray-400">Address</p>
                  <p className="text-white">{citizen.address}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Driver's License:</span>
                <span className={citizen.driversLicense ? "text-green-400" : "text-red-400"}>
                  {citizen.driversLicense ? "Valid" : "Invalid"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Weapons Permit:</span>
                <span className={citizen.weaponsPermit ? "text-green-400" : "text-red-400"}>
                  {citizen.weaponsPermit ? "Valid" : "None"}
                </span>
              </div>
            </div>

            {citizen.warrants.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Active Warrants</h4>
                <div className="space-y-2">
                  {citizen.warrants.filter(w => w.isActive).map((warrant, idx) => (
                    <div key={idx} className="p-3 bg-red-900/20 border border-red-800 rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-400">{warrant.offense}</p>
                          {warrant.bail && (
                            <p className="text-xs text-gray-400">Bail: ${warrant.bail.toLocaleString()}</p>
                          )}
                        </div>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {citizen.vehicles.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Registered Vehicles</h4>
                <div className="space-y-2">
                  {citizen.vehicles.map((vehicle, idx) => (
                    <div key={idx} className="p-3 bg-gray-800/50 border border-gray-700 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {vehicle.color} {vehicle.model}
                          </p>
                          <p className="text-xs text-gray-400">Plate: {vehicle.plate}</p>
                        </div>
                        <Car className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {vehicle && (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {vehicle.color} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-400">Plate: {vehicle.plate}</p>
                {vehicle.year && (
                  <p className="text-sm text-gray-400">Year: {vehicle.year}</p>
                )}
              </div>
              <div className="flex gap-2">
                {vehicle.isStolen && (
                  <div className="px-3 py-1 bg-red-900/50 border border-red-700 rounded-full">
                    <span className="text-xs font-semibold text-red-400">STOLEN</span>
                  </div>
                )}
                {vehicle.isWanted && (
                  <div className="px-3 py-1 bg-yellow-900/50 border border-yellow-700 rounded-full">
                    <span className="text-xs font-semibold text-yellow-400">WANTED</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Registered Owner</h4>
              <div className="p-3 bg-gray-800/50 border border-gray-700 rounded">
                <p className="text-white font-medium">
                  {vehicle.owner.firstName} {vehicle.owner.lastName}
                </p>
                {vehicle.owner.phoneNumber && (
                  <p className="text-sm text-gray-400">{vehicle.owner.phoneNumber}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
