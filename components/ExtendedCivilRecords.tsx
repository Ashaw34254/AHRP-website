"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Textarea,
  Tabs,
  Tab,
} from "@nextui-org/react";
import {
  Database,
  Plus,
  Search,
  Home,
  Briefcase,
  Shield as ShieldIcon,
  Eye,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Property {
  id: string;
  address: string;
  ownerName: string;
  propertyType: string;
  assessedValue: number | null;
  zoning: string | null;
  notes: string | null;
  createdAt: string;
}

interface BusinessLicense {
  id: string;
  businessName: string;
  ownerName: string;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  address: string | null;
  notes: string | null;
  createdAt: string;
}

interface FirearmRegistry {
  id: string;
  ownerName: string;
  ownerStateId: string | null;
  weaponType: string;
  make: string;
  model: string;
  serialNumber: string;
  caliber: string | null;
  registrationDate: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export function ExtendedCivilRecords() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [licenses, setLicenses] = useState<BusinessLicense[]>([]);
  const [firearms, setFirearms] = useState<FirearmRegistry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("properties");

  const { isOpen: isPropertyOpen, onOpen: onPropertyOpen, onClose: onPropertyClose } = useDisclosure();
  const { isOpen: isLicenseOpen, onOpen: onLicenseOpen, onClose: onLicenseClose } = useDisclosure();
  const { isOpen: isFirearmOpen, onOpen: onFirearmOpen, onClose: onFirearmClose } = useDisclosure();

  const [propertyForm, setPropertyForm] = useState({
    address: "",
    ownerName: "",
    propertyType: "RESIDENTIAL",
    assessedValue: "",
    zoning: "",
    notes: "",
  });

  const [licenseForm, setLicenseForm] = useState({
    businessName: "",
    ownerName: "",
    licenseType: "BUSINESS_OPERATION",
    issueDate: "",
    expiryDate: "",
    address: "",
    notes: "",
  });

  const [firearmForm, setFirearmForm] = useState({
    ownerName: "",
    ownerStateId: "",
    weaponType: "HANDGUN",
    make: "",
    model: "",
    serialNumber: "",
    caliber: "",
    notes: "",
  });

  useEffect(() => {
    fetchProperties();
    fetchLicenses();
    fetchFirearms();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/cad/civil/property");
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await fetch("/api/cad/civil/licenses");
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error("Failed to fetch licenses:", error);
    }
  };

  const fetchFirearms = async () => {
    try {
      const response = await fetch("/api/cad/civil/firearms");
      if (response.ok) {
        const data = await response.json();
        setFirearms(data.firearms || []);
      }
    } catch (error) {
      console.error("Failed to fetch firearms:", error);
    }
  };

  const handleCreateProperty = async () => {
    if (!propertyForm.address || !propertyForm.ownerName) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/civil/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...propertyForm,
          assessedValue: propertyForm.assessedValue ? parseFloat(propertyForm.assessedValue) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create property");

      toast.success("Property record created");
      fetchProperties();
      onPropertyClose();
      resetPropertyForm();
    } catch (error) {
      console.error("Failed to create property:", error);
      toast.error("Failed to create property record");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicense = async () => {
    if (!licenseForm.businessName || !licenseForm.ownerName || !licenseForm.issueDate || !licenseForm.expiryDate) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/civil/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...licenseForm,
          issueDate: new Date(licenseForm.issueDate).toISOString(),
          expiryDate: new Date(licenseForm.expiryDate).toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create license");

      toast.success("Business license created");
      fetchLicenses();
      onLicenseClose();
      resetLicenseForm();
    } catch (error) {
      console.error("Failed to create license:", error);
      toast.error("Failed to create business license");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFirearm = async () => {
    if (!firearmForm.ownerName || !firearmForm.make || !firearmForm.model || !firearmForm.serialNumber) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/civil/firearms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firearmForm),
      });

      if (!response.ok) throw new Error("Failed to register firearm");

      toast.success("Firearm registered");
      fetchFirearms();
      onFirearmClose();
      resetFirearmForm();
    } catch (error) {
      console.error("Failed to register firearm:", error);
      toast.error("Failed to register firearm");
    } finally {
      setLoading(false);
    }
  };

  const resetPropertyForm = () => {
    setPropertyForm({
      address: "",
      ownerName: "",
      propertyType: "RESIDENTIAL",
      assessedValue: "",
      zoning: "",
      notes: "",
    });
  };

  const resetLicenseForm = () => {
    setLicenseForm({
      businessName: "",
      ownerName: "",
      licenseType: "BUSINESS_OPERATION",
      issueDate: "",
      expiryDate: "",
      address: "",
      notes: "",
    });
  };

  const resetFirearmForm = () => {
    setFirearmForm({
      ownerName: "",
      ownerStateId: "",
      weaponType: "HANDGUN",
      make: "",
      model: "",
      serialNumber: "",
      caliber: "",
      notes: "",
    });
  };

  const filteredProperties = properties.filter((prop) =>
    prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLicenses = licenses.filter((lic) =>
    lic.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lic.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lic.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFirearms = firearms.filter((fa) =>
    fa.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fa.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fa.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fa.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiredLicenses = licenses.filter((lic) => {
    const expiryDate = new Date(lic.expiryDate);
    return expiryDate < new Date() && lic.status === "ACTIVE";
  });

  const expiringLicenses = licenses.filter((lic) => {
    const expiryDate = new Date(lic.expiryDate);
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate >= new Date() && expiryDate <= thirtyDays && lic.status === "ACTIVE";
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border-2 border-cyan-500/30">
              <Database className="w-7 h-7 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Extended Civil Records</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Home className="w-4 h-4" />
                  {properties.length} properties
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Briefcase className="w-4 h-4" />
                  {licenses.length} licenses
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-orange-400">
                  <ShieldIcon className="w-4 h-4" />
                  {firearms.length} firearms
                </span>
                {(expiredLicenses.length > 0 || expiringLicenses.length > 0) && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1.5 text-red-400">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      {expiredLicenses.length + expiringLicenses.length} expiring/expired
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="w-4 h-4 text-gray-500" />}
            classNames={{
              input: "bg-gray-800/50",
              inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
            }}
          />
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "bg-gray-900/50 border border-gray-800 rounded-lg p-2",
          tab: "data-[selected=true]:text-cyan-400",
        }}
      >
        {/* Properties Tab */}
        <Tab
          key="properties"
          title={
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Properties ({filteredProperties.length})</span>
            </div>
          }
        >
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button color="primary" variant="shadow" startContent={<Plus />} onPress={onPropertyOpen} className="font-semibold">
                Add Property
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 hover:border-gray-600">
                  <CardBody className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                          <Home className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{property.address}</h3>
                          <p className="text-sm text-gray-400">{property.ownerName}</p>
                        </div>
                      </div>
                      <Chip size="sm" variant="flat" className="uppercase">
                        {property.propertyType.replace("_", " ")}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {property.assessedValue && (
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <p className="text-white font-semibold">${property.assessedValue.toLocaleString()}</p>
                        </div>
                      )}
                      {property.zoning && (
                        <div>
                          <span className="text-gray-500">Zoning:</span>
                          <p className="text-white font-semibold">{property.zoning}</p>
                        </div>
                      )}
                    </div>

                    {property.notes && (
                      <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                        <p className="text-xs text-gray-400">{property.notes}</p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </Tab>

        {/* Business Licenses Tab */}
        <Tab
          key="licenses"
          title={
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Business Licenses ({filteredLicenses.length})</span>
            </div>
          }
        >
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button color="primary" variant="shadow" startContent={<Plus />} onPress={onLicenseOpen} className="font-semibold">
                Add License
              </Button>
            </div>

            <div className="space-y-3">
              {filteredLicenses.map((license) => {
                const expiryDate = new Date(license.expiryDate);
                const isExpired = expiryDate < new Date();
                const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const isExpiringSoon = expiryDate >= new Date() && expiryDate <= thirtyDays;

                return (
                  <Card
                    key={license.id}
                    className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
                      isExpired
                        ? "border-red-700/50 hover:border-red-600/70"
                        : isExpiringSoon
                        ? "border-orange-700/50 hover:border-orange-600/70"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <CardBody className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                              <Briefcase className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{license.businessName}</h3>
                              <p className="text-sm text-gray-400">{license.ownerName}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">License #:</span>
                              <p className="text-white font-mono font-semibold">{license.licenseNumber}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <p className="text-white font-semibold">{license.licenseType.replace("_", " ")}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Issued:</span>
                              <p className="text-white">{new Date(license.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Expires:</span>
                              <p className={`font-semibold ${isExpired ? "text-red-400" : isExpiringSoon ? "text-orange-400" : "text-white"}`}>
                                {expiryDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {license.address && (
                            <div className="mb-2">
                              <span className="text-gray-500 text-sm">Address:</span>
                              <p className="text-white text-sm">{license.address}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Chip
                              size="sm"
                              color={license.status === "ACTIVE" ? "success" : license.status === "SUSPENDED" ? "warning" : "default"}
                              variant="solid"
                            >
                              {license.status}
                            </Chip>
                            {isExpired && (
                              <Chip size="sm" color="danger" variant="bordered" startContent={<AlertTriangle className="w-3 h-3" />}>
                                EXPIRED
                              </Chip>
                            )}
                            {isExpiringSoon && !isExpired && (
                              <Chip size="sm" color="warning" variant="bordered" startContent={<AlertTriangle className="w-3 h-3" />}>
                                EXPIRING SOON
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </Tab>

        {/* Firearms Tab */}
        <Tab
          key="firearms"
          title={
            <div className="flex items-center gap-2">
              <ShieldIcon className="w-4 h-4" />
              <span>Firearms Registry ({filteredFirearms.length})</span>
            </div>
          }
        >
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button color="primary" variant="shadow" startContent={<Plus />} onPress={onFirearmOpen} className="font-semibold">
                Register Firearm
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredFirearms.map((firearm) => (
                <Card
                  key={firearm.id}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
                    firearm.status === "STOLEN"
                      ? "border-red-700/50 hover:border-red-600/70 animate-pulse"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <CardBody className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${firearm.status === "STOLEN" ? "bg-red-500/10" : "bg-orange-500/10"}`}>
                          <ShieldIcon className={`w-5 h-5 ${firearm.status === "STOLEN" ? "text-red-500" : "text-orange-500"}`} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{firearm.make} {firearm.model}</h3>
                          <p className="text-sm text-gray-400">{firearm.ownerName}</p>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        color={firearm.status === "REGISTERED" ? "success" : firearm.status === "STOLEN" ? "danger" : "warning"}
                        variant="solid"
                        className="font-bold"
                      >
                        {firearm.status}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="text-white font-semibold">{firearm.weaponType.replace("_", " ")}</p>
                      </div>
                      {firearm.caliber && (
                        <div>
                          <span className="text-gray-500">Caliber:</span>
                          <p className="text-white font-semibold">{firearm.caliber}</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-gray-500">Serial #:</span>
                        <p className="text-white font-mono font-bold">{firearm.serialNumber}</p>
                      </div>
                      {firearm.ownerStateId && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Owner State ID:</span>
                          <p className="text-white font-mono">{firearm.ownerStateId}</p>
                        </div>
                      )}
                    </div>

                    {firearm.status === "STOLEN" && (
                      <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/50">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                          <AlertTriangle className="w-4 h-4" />
                          STOLEN FIREARM - APPROACH WITH CAUTION
                        </div>
                      </div>
                    )}

                    {firearm.notes && (
                      <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                        <p className="text-xs text-gray-400">{firearm.notes}</p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Property Modal */}
      <Modal isOpen={isPropertyOpen} onClose={onPropertyClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Home className="w-5 h-5 text-cyan-500" />
            </div>
            Add Property Record
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Property Address"
                placeholder="123 Main St, City, State ZIP"
                value={propertyForm.address}
                onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Input
                label="Owner Name"
                placeholder="Full name..."
                value={propertyForm.ownerName}
                onChange={(e) => setPropertyForm({ ...propertyForm, ownerName: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Select
                label="Property Type"
                selectedKeys={[propertyForm.propertyType]}
                onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                variant="bordered"
              >
                <SelectItem key="RESIDENTIAL">Residential</SelectItem>
                <SelectItem key="COMMERCIAL">Commercial</SelectItem>
                <SelectItem key="INDUSTRIAL">Industrial</SelectItem>
                <SelectItem key="AGRICULTURAL">Agricultural</SelectItem>
                <SelectItem key="VACANT_LAND">Vacant Land</SelectItem>
              </Select>

              <Input
                label="Assessed Value (Optional)"
                type="number"
                placeholder="0"
                value={propertyForm.assessedValue}
                onChange={(e) => setPropertyForm({ ...propertyForm, assessedValue: e.target.value })}
                startContent={<span className="text-gray-500">$</span>}
                variant="bordered"
              />

              <Input
                label="Zoning (Optional)"
                placeholder="e.g., R-1, C-2"
                value={propertyForm.zoning}
                onChange={(e) => setPropertyForm({ ...propertyForm, zoning: e.target.value })}
                variant="bordered"
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional property information..."
                value={propertyForm.notes}
                onChange={(e) => setPropertyForm({ ...propertyForm, notes: e.target.value })}
                minRows={3}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPropertyClose}>Cancel</Button>
            <Button color="primary" variant="shadow" onPress={handleCreateProperty} isLoading={loading} startContent={<Plus />} className="font-semibold">
              Add Property
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Business License Modal */}
      <Modal isOpen={isLicenseOpen} onClose={onLicenseClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            Add Business License
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Business Name"
                placeholder="Business name..."
                value={licenseForm.businessName}
                onChange={(e) => setLicenseForm({ ...licenseForm, businessName: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Input
                label="Owner Name"
                placeholder="Full name..."
                value={licenseForm.ownerName}
                onChange={(e) => setLicenseForm({ ...licenseForm, ownerName: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Select
                label="License Type"
                selectedKeys={[licenseForm.licenseType]}
                onChange={(e) => setLicenseForm({ ...licenseForm, licenseType: e.target.value })}
                variant="bordered"
              >
                <SelectItem key="BUSINESS_OPERATION">Business Operation</SelectItem>
                <SelectItem key="FOOD_SERVICE">Food Service</SelectItem>
                <SelectItem key="LIQUOR_LICENSE">Liquor License</SelectItem>
                <SelectItem key="PROFESSIONAL">Professional</SelectItem>
                <SelectItem key="CONTRACTOR">Contractor</SelectItem>
                <SelectItem key="VENDOR">Vendor</SelectItem>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Issue Date"
                  type="date"
                  value={licenseForm.issueDate}
                  onChange={(e) => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                  isRequired
                  variant="bordered"
                />

                <Input
                  label="Expiry Date"
                  type="date"
                  value={licenseForm.expiryDate}
                  onChange={(e) => setLicenseForm({ ...licenseForm, expiryDate: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <Input
                label="Business Address (Optional)"
                placeholder="123 Business St..."
                value={licenseForm.address}
                onChange={(e) => setLicenseForm({ ...licenseForm, address: e.target.value })}
                variant="bordered"
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional license information..."
                value={licenseForm.notes}
                onChange={(e) => setLicenseForm({ ...licenseForm, notes: e.target.value })}
                minRows={3}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onLicenseClose}>Cancel</Button>
            <Button color="primary" variant="shadow" onPress={handleCreateLicense} isLoading={loading} startContent={<Plus />} className="font-semibold">
              Add License
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Firearm Registry Modal */}
      <Modal isOpen={isFirearmOpen} onClose={onFirearmClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <ShieldIcon className="w-5 h-5 text-orange-500" />
            </div>
            Register Firearm
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Owner Name"
                placeholder="Full name..."
                value={firearmForm.ownerName}
                onChange={(e) => setFirearmForm({ ...firearmForm, ownerName: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Input
                label="Owner State ID (Optional)"
                placeholder="State ID number..."
                value={firearmForm.ownerStateId}
                onChange={(e) => setFirearmForm({ ...firearmForm, ownerStateId: e.target.value })}
                variant="bordered"
              />

              <Select
                label="Weapon Type"
                selectedKeys={[firearmForm.weaponType]}
                onChange={(e) => setFirearmForm({ ...firearmForm, weaponType: e.target.value })}
                variant="bordered"
              >
                <SelectItem key="HANDGUN">Handgun</SelectItem>
                <SelectItem key="RIFLE">Rifle</SelectItem>
                <SelectItem key="SHOTGUN">Shotgun</SelectItem>
                <SelectItem key="ASSAULT_RIFLE">Assault Rifle</SelectItem>
                <SelectItem key="SMG">SMG (Submachine Gun)</SelectItem>
                <SelectItem key="OTHER">Other</SelectItem>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Make"
                  placeholder="e.g., Glock"
                  value={firearmForm.make}
                  onChange={(e) => setFirearmForm({ ...firearmForm, make: e.target.value })}
                  isRequired
                  variant="bordered"
                />

                <Input
                  label="Model"
                  placeholder="e.g., 19"
                  value={firearmForm.model}
                  onChange={(e) => setFirearmForm({ ...firearmForm, model: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <Input
                label="Serial Number"
                placeholder="Serial number..."
                value={firearmForm.serialNumber}
                onChange={(e) => setFirearmForm({ ...firearmForm, serialNumber: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Input
                label="Caliber (Optional)"
                placeholder="e.g., 9mm, .45 ACP"
                value={firearmForm.caliber}
                onChange={(e) => setFirearmForm({ ...firearmForm, caliber: e.target.value })}
                variant="bordered"
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional firearm information..."
                value={firearmForm.notes}
                onChange={(e) => setFirearmForm({ ...firearmForm, notes: e.target.value })}
                minRows={3}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onFirearmClose}>Cancel</Button>
            <Button color="primary" variant="shadow" onPress={handleCreateFirearm} isLoading={loading} startContent={<Plus />} className="font-semibold">
              Register Firearm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
