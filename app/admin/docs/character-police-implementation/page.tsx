"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Users, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function CharacterPoliceImplementationDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-600/20 rounded-lg">
              <Users className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Character & Police Implementation Complete</h1>
              <p className="text-gray-400">Technical implementation details and code examples</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/CHARACTER-POLICE-IMPLEMENTATION-COMPLETE.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">✅ Implementation Status</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <h4 className="font-semibold text-green-400 mb-2">✅ Database Schema</h4>
                  <p className="text-sm text-gray-400">Character and Officer models with full relations</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <h4 className="font-semibold text-green-400 mb-2">✅ API Endpoints</h4>
                  <p className="text-sm text-gray-400">CRUD operations for characters and officers</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <h4 className="font-semibold text-green-400 mb-2">✅ UI Components</h4>
                  <p className="text-sm text-gray-400">Character forms, lists, and management interfaces</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <h4 className="font-semibold text-green-400 mb-2">✅ CAD Integration</h4>
                  <p className="text-sm text-gray-400">Officer profiles linked to CAD units</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📝 Code Examples</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h4 className="font-semibold text-violet-400 mb-2">Create Character (API)</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`// app/api/characters/route.ts
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  
  const character = await prisma.character.create({
    data: {
      ...data,
      userId: session.user.id,
      stateId: generateStateId(), // Auto-generate
      isApproved: false // Pending approval
    }
  });

  return NextResponse.json({ character });
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-violet-400 mb-2">Character Form Component</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  height: "",
  weight: "",
  eyeColor: "",
  hairColor: "",
  department: "CIVILIAN",
  occupation: "",
  backstory: ""
});

const handleSubmit = async () => {
  const res = await fetch("/api/characters", {
    method: "POST",
    body: JSON.stringify(formData)
  });
  
  if (res.ok) {
    toast.success("Character created!");
    router.push("/dashboard/characters");
  }
};`}
                </pre>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Database Relations Implementation</h2></CardHeader>
            <CardBody>
              <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`model Character {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Personal info
  firstName   String
  lastName    String
  dateOfBirth String
  stateId     String   @unique
  
  // Physical appearance
  gender      String
  height      String?
  weight      String?
  eyeColor    String?
  hairColor   String?
  
  // Employment
  department  String   // POLICE, FIRE, EMS, CIVILIAN
  occupation  String?
  rank        String?
  badgeNumber String?
  
  // Approval
  isApproved  Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Officer {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  characterId    String?  @unique
  character      Character? @relation(fields: [characterId], references: [id])
  
  badgeNumber    String   @unique
  rank           String
  department     String
  certifications String?  // JSON
  
  units          Unit[]
  trainingRecords TrainingRecord[]
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}`}
              </pre>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎨 UI Component Files</h2></CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm font-mono">
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-violet-400">app/dashboard/characters/page.tsx</strong> <span className="text-gray-400">- Character list view</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-violet-400">app/dashboard/characters/create/page.tsx</strong> <span className="text-gray-400">- Character creation form</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-violet-400">app/admin/officers/page.tsx</strong> <span className="text-gray-400">- Officer management panel</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-violet-400">components/OfficerProfiles.tsx</strong> <span className="text-gray-400">- Officer profile cards</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🛡️ Access Control Implementation</h2></CardHeader>
            <CardBody>
              <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`// Middleware check for CAD access
export async function CADAccessCheck(userId: string) {
  const officer = await prisma.officer.findFirst({
    where: { userId },
    include: { character: true }
  });
  
  // Must have approved character with officer profile
  if (!officer || !officer.character?.isApproved) {
    return { hasAccess: false, reason: "Not authorized" };
  }
  
  return { hasAccess: true, officer };
}

// Usage in CAD pages
const { hasAccess, officer } = await CADAccessCheck(session.user.id);
if (!hasAccess) {
  return redirect("/dashboard/characters?error=not-approved");
}`}
              </pre>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📊 Admin Approval Workflow</h2></CardHeader>
            <CardBody>
              <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`// app/api/admin/characters/[id]/approve/route.ts
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { approved, feedback } = await req.json();
  
  const character = await prisma.character.update({
    where: { id: params.id },
    data: {
      isApproved: approved,
      approvalFeedback: feedback
    }
  });
  
  // Notify user
  await prisma.notification.create({
    data: {
      userId: character.userId,
      title: approved ? "Character Approved!" : "Character Needs Revision",
      message: feedback
    }
  });
  
  return NextResponse.json({ character });
}`}
              </pre>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚀 Features Implemented</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> Multi-step character creation form with validation</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> Rich text editor for backstory field</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> Auto-generated unique State IDs</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> Character approval workflow with feedback system</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> Officer profile generation from approved characters</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> CAD integration with access control</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> Character edit/delete with permission checks</li>
                <li className="flex items-start gap-2"><span className="text-violet-400">✓</span> JSON storage for personality traits and skills</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/character-police-data" variant="flat" className="justify-start">
                  ← Data Integration Guide
                </Button>
                <Button as="a" href="/admin/docs/character-police-setup" variant="flat" className="justify-start">
                  Setup Guide
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
