"use client";

import { useState } from "react";

import { site } from "@/content/site";

/**
 * Direct-to-inbox contact form.
 *
 * The site has no backend, so submissions go through FormSubmit, which
 * forwards them to `site.email`. With JavaScript the post is AJAX and the
 * visitor stays on the page; without it the form falls back to a native POST
 * to the same service and returns via `_next`.
 *
 * FormSubmit activates on first use. The first message triggers a one-time
 * confirmation email to the inbox; forwarding starts once it is confirmed.
 *
 * The visitor's address is sent as `email`, which FormSubmit sets as the
 * Reply-To, so answering a message is just pressing reply.
 */

type Status = "idle" | "sending" | "sent" | "error";

const ENDPOINT = `https://formsubmit.co/${site.email}`;

const inputClasses =
  "w-full border border-line bg-transparent px-4 py-3 text-[0.9375rem] leading-relaxed text-fg placeholder:text-faint focus:border-line-strong focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot. Bots fill every field; humans never see this one.
    if (data.get("_honey")) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      // The fields keep their values, so nothing the visitor wrote is lost.
      setStatus("error");
    }
  };

  return (
    <form
      action={ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      className="mt-8 max-w-[36rem] space-y-5"
    >
      {/* No-JS fallback settings and spam trap. */}
      <input type="hidden" name="_subject" value="Message from the website" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={`${site.url}/#contact`} />
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint"
        >
          Your email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What are you working on?"
          className={`${inputClasses} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-line px-6 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg transition-colors duration-300 hover:border-fg disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`font-mono text-[0.625rem] uppercase tracking-[0.14em] ${
            status === "error" ? "text-muted" : "text-faint"
          }`}
        >
          {status === "sent" && "Sent. It goes straight to my inbox."}
          {status === "error" && "Sending failed. Your message is still here, try again."}
        </p>
      </div>
    </form>
  );
}
