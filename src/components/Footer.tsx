import Link from "next/link";
import { Logo } from "../../public/svg/svg";

const footerLinks = {
  Company: [
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Product: [
    { label: "Customer", href: "/customer" },
    { label: "Agent", href: "/agent" },
    { label: "Rider", href: "/rider" },
  ],
  Terms: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms & condition", href: "/terms" },
  ],
};

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@ojarun.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d4a2a] px-6 pb-24 sm:px-10 pt-30 ">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-12 md:flex-row md:gap-8">
          {/* ── Left: Logo + Socials + Copyright ── */}
          <div className="flex flex-col gap-6 md:w-64">
            <Link href="/" aria-label="Ojarun home" className="inline-block transition-opacity hover:opacity-80">
              <Logo className="h-12 w-auto sm:h-16" />
            </Link>
            <div className="flex items-center gap-4 text-white">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="transition hover:text-white-70"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="text-sm sm:text-base text-white/50">
              ©2026 Ojarun. All Rights Reserved
            </p>
          </div>

          {/* ── Right: Link Columns ── */}
          <div className="flex flex-1 flex-wrap gap-10 md:justify-end">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="min-w-[120px]">
                <h3 className="mb-4 text-sm font-semibold text-white">
                  {group}
                </h3>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}