"use client";

import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { 
  Heart, 
  CreditCard, 
  Gift, 
  TrendingUp,
  Users,
  CheckCircle,
  DollarSign
} from "lucide-react";
import Link from "next/link";

const donationTiers = [
  {
    name: "Supporter",
    amount: 5,
    color: "primary",
    perks: [
      "Supporter badge in Discord",
      "Access to supporter-only channels",
      "Priority application review",
      "Custom vehicle colors",
    ],
  },
  {
    name: "Patron",
    amount: 15,
    color: "secondary",
    popular: true,
    perks: [
      "All Supporter perks",
      "Patron badge in-game & Discord",
      "Priority server queue (2 slots)",
      "Exclusive vehicle models",
      "Custom character slots (+2)",
    ],
  },
  {
    name: "VIP",
    amount: 30,
    color: "warning",
    perks: [
      "All Patron perks",
      "VIP badge in-game & Discord",
      "Priority server queue (4 slots)",
      "Exclusive VIP lounge access",
      "Custom character slots (+5)",
      "Monthly custom vehicle request",
    ],
  },
  {
    name: "Legend",
    amount: 50,
    color: "danger",
    perks: [
      "All VIP perks",
      "Legendary badge in-game & Discord",
      "Reserved server slot",
      "Unlimited character slots",
      "Weekly custom vehicle requests",
      "Direct line to staff team",
      "Lifetime recognition",
    ],
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-red-600/20 rounded-full">
              <Heart className="w-16 h-16 text-red-400" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
            Support Aurora Horizon RP
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Help us maintain and improve Aurora Horizon RP. Your support keeps our servers running and enables us to deliver the best roleplay experience.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">1,247</div>
                <p className="text-sm text-gray-400">Active Members</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">$2.4K</div>
                <p className="text-sm text-gray-400">Monthly Goal</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">87%</div>
                <p className="text-sm text-gray-400">Goal Reached</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">342</div>
                <p className="text-sm text-gray-400">Supporters</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Choose Your Support Level
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Select a tier that works for you. All donations help keep our community thriving.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`bg-gray-900/50 border ${tier.popular ? 'border-purple-500 border-2' : 'border-gray-800'} hover:scale-105 transition-transform relative`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Chip color="secondary" variant="solid" size="sm">
                      Most Popular
                    </Chip>
                  </div>
                )}
                
                <CardBody className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">${tier.amount}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    fullWidth
                    color={tier.color as any}
                    size="lg"
                    startContent={<CreditCard className="w-5 h-5" />}
                  >
                    Select {tier.name}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* One-Time Donation */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Prefer a One-Time Donation?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Not ready for a monthly commitment? You can still support us with a one-time donation of any amount.
          </p>
          <Button
            size="lg"
            color="warning"
            variant="shadow"
            startContent={<Heart className="w-5 h-5" />}
          >
            Make a One-Time Donation
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  Where does my donation go?
                </h3>
                <p className="text-gray-400">
                  Your support covers server hosting costs, custom script development, security measures, and community events. We maintain full transparency with monthly financial reports.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  Is this pay-to-win?
                </h3>
                <p className="text-gray-400">
                  Absolutely not! Donations provide cosmetic perks and quality-of-life improvements only. No gameplay advantages are given to supporters. Fair play is our priority.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-400">
                  Yes, you can cancel anytime through your payment provider. You&apos;ll retain your perks until the end of your current billing period. No questions asked!
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-400">
                  We accept all major credit cards, PayPal, and cryptocurrency. Choose whatever works best for you!
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900/30 via-pink-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Every Contribution Matters
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for considering supporting Aurora Horizon Roleplay. Together, we&apos;re building something special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              href="#tiers"
              size="lg"
              color="primary"
              className="min-w-[200px]"
            >
              View Support Tiers
            </Button>
            <Button
              as={Link}
              href="https://discord.gg/aurorahorizon"
              target="_blank"
              size="lg"
              variant="bordered"
              className="min-w-[200px]"
            >
              Join Our Discord
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
