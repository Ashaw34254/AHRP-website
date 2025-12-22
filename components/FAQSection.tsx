"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I join Aurora Horizon RP?",
    answer: "First, join our Discord server and read through the rules and guidelines. Then, submit a whitelist application with your character backstory. Once approved by our staff team, you'll receive access to the server and can begin your roleplay journey.",
  },
  {
    question: "Is the server whitelisted?",
    answer: "Yes, Aurora Horizon RP is a whitelisted community. This ensures quality roleplay and allows us to maintain our high standards. The application process helps us understand your roleplay style and ensures you're a good fit for our community.",
  },
  {
    question: "What are the server requirements?",
    answer: "You'll need FiveM installed, a working microphone for voice communication, and a stable internet connection. We also require all players to be 18+ and follow our community guidelines for mature, realistic roleplay.",
  },
  {
    question: "Can I play as a police officer or EMS immediately?",
    answer: "Department positions require additional applications and training. New players typically start as civilians to learn the server mechanics and roleplay standards. Once you're familiar with the community, you can apply for department positions.",
  },
  {
    question: "What makes AHRP different from other servers?",
    answer: "We feature a custom-built CAD system, professional department structures, experienced staff, and a commitment to realistic roleplay. Our focus on long-term character development and story-driven experiences sets us apart from other communities.",
  },
  {
    question: "Is there an economy system?",
    answer: "Yes, we have a balanced economy with various legal and illegal ways to earn money. You can own businesses, work jobs, participate in the criminal underworld, or pursue department careers. The economy is designed for long-term engagement.",
  },
  {
    question: "What time zone is the server most active?",
    answer: "AHRP is optimized for Australian and New Zealand time zones (AEST/NZST), but we have players from around the world. Peak hours are typically 6 PM - 2 AM AEST, with active players throughout the day.",
  },
  {
    question: "How often are there server events?",
    answer: "We host regular community events including races, department training scenarios, civilian gatherings, and special storyline events. Staff-organized events typically occur weekly, with spontaneous roleplay scenarios happening daily.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <HelpCircle className="w-4 h-4 text-indigo-300" />
            <span className="text-indigo-300 text-sm font-semibold">Got Questions?</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Frequently Asked <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about joining AHRP
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Accordion
            variant="splitted"
            className="gap-4"
            itemClasses={{
              base: "bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors",
              title: "text-white font-semibold text-lg",
              trigger: "py-6 px-6",
              content: "text-gray-400 pb-6 px-6 pt-0 leading-relaxed",
            }}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                aria-label={faq.question}
                title={faq.question}
                className="group"
              >
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Join our Discord and our friendly staff team will be happy to help!
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70">
              Join Discord
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
