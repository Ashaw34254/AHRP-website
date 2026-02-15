"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@heroui/react";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is the roleplay style on AHRP?",
    answer: "Aurora Horizon RP focuses on realistic, story-driven roleplay. Players are expected to follow immersive scenarios, whether in police, EMS, civilian life, or criminal enterprises. Our rules encourage teamwork, proper procedure, and meaningful character development.",
  },
  {
    question: "Are there custom vehicles, weapons, or scripts?",
    answer: "Yes! AHRP features custom vehicles, tools, and scripts designed to enhance realism and roleplay immersion without disrupting balance. All content is integrated to make gameplay feel authentic and engaging.",
  },
  {
    question: "Can I create my own storylines or businesses?",
    answer: "Absolutely! Players are encouraged to roleplay creatively beyond departments, including businesses, shops, criminal enterprises, or personal story arcs, as long as it fits within the server rules and immersion standards.",
  },
  {
    question: "Do I need previous RP experience?",
    answer: "No prior experience is required. New players can start as civilians or in departments and learn roleplay expectations on the job. However, familiarity with FiveM and RP etiquette can help you get started faster.",
  },
  {
    question: "How do promotions or rank progression work?",
    answer: "Rank progression in police, EMS, or other roles is based on experience, performance, and training. Higher or specialised positions, such as CIU, require applications, additional training, or seniority within the department.",
  },
  {
    question: "How does the community handle griefing or rule-breaking?",
    answer: "AHRP has a fair and professional staff team that enforces rules and addresses issues promptly. The focus is on maintaining immersion and ensuring all players can enjoy a positive and realistic roleplay environment.",
  },
  {
    question: "Is voice chat mandatory?",
    answer: "Voice chat is highly recommended for roleplay and team coordination, especially in police or EMS roles. Text chat may be used in certain situations, but immersion and communication work best through voice.",
  },
  {
    question: "How do I get help or support on the server?",
    answer: "Players can reach out to staff directly via Discord, in-game support channels, or consult guides and pinned resources. Our community is welcoming and ready to assist new players at any time.",
  },
  {
    question: "What types of server events are available?",
    answer: "AHRP hosts a mix of events, including community races, department training exercises, civilian gatherings, and ongoing story-driven events. Staff organise weekly events, with daily spontaneous roleplay scenarios to keep the world active.",
  },
  {
    question: "Are there any age or content restrictions?",
    answer: "Yes. AHRP is an 18+ server. All players are expected to engage in mature, realistic roleplay and follow community guidelines regarding behaviour, language, and content.",
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
    <a
      href="https://discord.gg/VusbA9SpXv" // Replace with your actual Discord invite
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
    >
      Join Discord
    </a>
  </div>
</motion.div>

      </div>
    </section>
  );
}
