"use client";

import { useState, type FormEvent } from "react";

import { submitContactMessage } from "@/lib/api/public";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await submitContactMessage(formData);
      setSuccessMessage("Message sent successfully.");
      setFormData(initialState);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-semibold text-white">Contact</h2>
      <form className="max-w-xl space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="contact-name" className="text-sm text-zinc-300">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-email" className="text-sm text-zinc-300">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-message" className="text-sm text-zinc-300">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={formData.message}
            onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>

      {successMessage ? <p className="mt-3 text-sm text-emerald-300">{successMessage}</p> : null}
      {errorMessage ? <p className="mt-3 text-sm text-red-300">{errorMessage}</p> : null}
    </section>
  );
}
