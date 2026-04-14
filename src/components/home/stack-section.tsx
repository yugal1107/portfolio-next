"use client";

import { motion } from "motion/react";
import { Cpu, Globe, Database } from "lucide-react";
import type { SkillGroup } from "@/types/content";

type StackSectionProps = {
  skillGroups: SkillGroup[];
};

export function StackSection({ skillGroups }: StackSectionProps) {
  const icons = [Cpu, Globe, Database];
  const gradients = [
    "from-primary to-transparent",
    "from-secondary to-transparent",
    "from-tertiary to-transparent"
  ];

  return (
    <section id="stack" className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-4">The Engine Room</h2>
        <h3 className="text-5xl font-headline font-bold tracking-tighter">Tech Stack</h3>
      </div>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid md:grid-cols-3 gap-8"
      >
        {skillGroups.map((group, i) => {
          const IconComponent = icons[i % icons.length];
          const gradientClass = gradients[i % gradients.length];
          
          return (
            <motion.div 
              key={group.id} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="group relative"
            >
              <div className={`absolute -inset-0.5 rounded-3xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br ${gradientClass}`}></div>
              
              <div className="relative h-full bg-surface-container-lowest/40 backdrop-blur-xl rounded-2xl p-8 border border-outline-variant/20 group-hover:border-outline-variant/40 transition-all flex flex-col space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-surface-container-high shadow-inner">
                    <IconComponent className={`w-5 h-5 ${i === 0 ? 'text-primary' : i === 1 ? 'text-secondary' : 'text-tertiary'}`} />
                  </div>
                  <h3 className="text-2xl font-bold font-headline">{group.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill) => (
                    <motion.span 
                      key={skill.id} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-surface-container-high px-4 py-2 rounded-lg text-sm border border-outline-variant/10 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-colors cursor-default shadow-sm"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}