"use client";

import { motion } from "motion/react";

const experience = [
  {
    company: "Algo8 AI",
    role: "Backend Developer Intern",
    period: "Oct 2025 — Present",
    description: "Developing Node.js/Express services, managing MongoDB and MySQL databases using Sequelize and Mongoose.",
    skills: ["Node.js", "Express", "MongoDB", "MySQL"]
  },
  {
    company: "Educerns Technologies",
    role: "Full Stack Developer Intern",
    period: "May 2025 — July 2025",
    description: "Built RESTful APIs and responsive frontend components. Implemented Git branching and Docker containerization.",
    skills: ["React", "Node.js", "Tailwind", "Docker"]
  }
];

export function ExperienceSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto">
      <h2 className="text-sm font-headline font-medium tracking-[0.4em] uppercase text-outline mb-16">Professional Journey</h2>
      <div className="space-y-16">
        {experience.map((exp, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-12 gap-8 border-l border-outline-variant/20 pl-8 relative"
          >
            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary ring-4 ring-surface"></div>
            <div className="md:col-span-3">
              <span className="text-on-surface-variant font-headline font-bold">{exp.period}</span>
            </div>
            <div className="md:col-span-9 space-y-4">
              <h3 className="text-2xl font-bold">{exp.role} <span className="text-primary">@ {exp.company}</span></h3>
              <p className="text-on-surface-variant max-w-2xl">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill, j) => (
                  <span key={j} className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-label text-on-surface-variant uppercase tracking-tighter">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}