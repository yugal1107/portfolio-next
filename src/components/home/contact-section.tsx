"use client";

import { useState } from "react";
import { Mail, Linkedin } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { submitContactMessage } from "@/lib/api/public";
import type { SiteSettings } from "@/types/content";

type ContactSectionProps = {
  settings: SiteSettings | null;
};

export function ContactSection({ settings }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitContactMessage({ name, email, message });
      setSubmitStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:pl-32 max-w-7xl mx-auto border-t border-outline-variant/10">
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-8">
          <h2 className="text-6xl font-headline font-bold tracking-tighter">Ready to start<br/><span className="text-primary">The Next Project?</span></h2>
          <p className="text-on-surface-variant text-lg">Currently seeking opportunities in full-stack and AI engineering roles.</p>
          <div className="space-y-6 pt-8">
            <a href={`mailto:${settings?.email || "yugal1107@gmail.com"}`} className="flex items-center gap-4 text-2xl font-headline font-bold hover:text-primary transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              {settings?.email || "yugal1107@gmail.com"}
            </a>
            <div className="flex gap-6 pt-4">
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-variant transition-all text-on-surface-variant hover:text-primary">
                  <FaXTwitter className="w-5 h-5" />
                </a>
              )}
              <a href={settings?.linkedinUrl || "https://www.linkedin.com/in/yugal-burde-58012a256/"} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-variant transition-all text-on-surface-variant hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8 rounded-2xl border border-outline-variant/10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-outline-variant">Your Name</label>
              <input 
                className="w-full bg-surface-container-highest border-none rounded-md p-4 focus:ring-1 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant" 
                placeholder="John Doe" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-outline-variant">Email Address</label>
              <input 
                className="w-full bg-surface-container-highest border-none rounded-md p-4 focus:ring-1 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant" 
                placeholder="john@example.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-outline-variant">Message</label>
            <textarea 
              className="w-full bg-surface-container-highest border-none rounded-md p-4 focus:ring-1 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant" 
              placeholder="How can I help you?" 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary py-4 rounded-md font-bold font-headline uppercase tracking-widest hover:scale-[1.01] transition-transform shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          {submitStatus === "success" && (
            <p className="text-green-500 text-center">Message sent successfully!</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}