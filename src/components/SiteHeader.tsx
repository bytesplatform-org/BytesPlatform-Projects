"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SITE_URL, main, withBase } from "@/lib/site";
import styles from "./SiteHeader.module.css";

/**
 * The main BytesPlatform header: the BYTES. mark, Start a project and a Menu
 * button that opens a floating panel from the top-right corner. Services and
 * Products push their own list in over the main one. Every link but Projects
 * (this site) leads to the main website, so these are plain <a> tags.
 */

type GroupKey = "services" | "products";

interface NavLink {
  label: string;
  href: string;
}

const service = (label: string, slug: string): NavLink => ({ label, href: main.service(slug) });
const product = (label: string, slug: string): NavLink => ({ label, href: `${SITE_URL}/products/${slug}` });

const groups: Record<GroupKey, { label: string; categories: { title?: string; links: NavLink[] }[] }> = {
  services: {
    label: "Services",
    categories: [
      {
        title: "Digital",
        links: [
          service("Digital Consulting & Strategy", "digital-consulting-strategy"),
          service("Custom SaaS Products", "saas-product-development"),
          service("Web & Mobile Apps", "web-mobile-app-development"),
          service("Digital Commerce", "digital-commerce"),
          service("CRM & ERP Systems", "crm-erp-systems"),
          service("Government Proposals", "government-proposal-technology"),
          service("E-Invoicing Integration", "e-invoicing-integration"),
          service("Web Development", "web"),
          service("App Development", "app"),
          service("SEO", "seo"),
          service("Marketing", "marketing"),
        ],
      },
      {
        title: "Data & AI",
        links: [
          service("AI Automation & Agents", "ai-automation"),
          service("Generative AI", "generative-ai"),
          service("Data Modernization", "data-modernization"),
          service("Advanced Analytics", "advanced-analytics"),
          service("Data Management", "data-management"),
          service("Connected Intelligence", "connected-intelligence"),
        ],
      },
      {
        title: "Cloud & Security",
        links: [
          service("Cloud Operations & Migration", "cloud-operations-migration"),
          service("Cloud App Development & Integration", "cloud-application-development"),
          service("Managed Services", "managed-services"),
          service("Digital Infrastructure", "digital-infrastructure"),
          service("Cybersecurity", "cybersecurity"),
          service("Emerging Technologies", "emerging-technologies"),
          service("Advanced Services", "advanced-services"),
        ],
      },
      {
        title: "Business Process Services",
        links: [
          service("Contact Center", "contact-center"),
          service("Finance & Accounting", "finance-accounting"),
          service("Staff Augmentation", "staff-augmentation"),
          service("Legal Process Outsourcing", "legal-process-outsourcing"),
          service("Recruitment Process Outsourcing", "recruitment-process-outsourcing"),
        ],
      },
    ],
  },
  products: {
    label: "Products",
    categories: [
      {
        links: [
          product("Byte Bots", "byte-bots"),
          product("Byte Suites", "byte-suites"),
          product("BytesGov", "bytesgov"),
          product("BytesBilling", "bytesbilling"),
          product("BytesAgentic", "bytesagentic"),
        ],
      },
    ],
  },
};

type MainItem = NavLink & { current?: boolean } | { label: string; group: GroupKey };

const mainNav: MainItem[] = [
  { label: "Home", href: main.home },
  { label: "About", href: main.about },
  // This site is the Projects page, so it is the current item
  { label: "Projects", href: withBase("/"), current: true },
  { label: "Services", group: "services" },
  { label: "Products", group: "products" },
  { label: "Industries", href: main.industries },
  { label: "E-Invoicing", href: `${SITE_URL}/e-invoicing` },
  { label: "Contact Us", href: main.contact },
];

const utilityLinks: NavLink[] = [
  { label: "Careers", href: main.careers },
  { label: "Blogs", href: main.blogs },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bytesplatform/",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className={styles.fill} cx="17.5" cy="6.7" r="1" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bytebloom-solutionss",
    icon: <path d="M6.2 9.2V19M6.2 5.2v.1M10.6 19v-5.5a4 4 0 0 1 8 0V19M10.6 9.2V19" />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Kc3xtzhqa/",
    icon: (
      <path
        className={styles.fill}
        d="M14 20v-7h2.5l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5H17V4.1c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V10H9v3h2.3v7"
      />
    ),
  },
];

/** Diagonal arrow shown on hover; a straight one leads into a group */
const ARROW_OUT = "M3.2 12.8 12.8 3.2m0 0H5.4m7.4 0v7.4";
const ARROW_IN = "M2.343 8h11.314m0 0-4.984 4.984M13.657 8 8.673 3.016";
const ARROW_BACK = "M13.657 8H2.343m0 0 4.984 4.984M2.343 8l4.984-4.984";

function Arrow({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Text whose letters roll up, one after another, on hover */
function Roll({ text }: { text: string }) {
  return (
    <span className={styles.roll}>
      <span className="sr-only">{text}</span>
      <span className={styles.rollLetters} aria-hidden="true">
        {[...text].map((ch, i) => {
          const c = ch === " " ? " " : ch;
          return (
            <span key={i} style={{ "--c": i } as CSSProperties}>
              <span data-char={c}>{c}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<GroupKey | null>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Partial<Record<GroupKey, HTMLButtonElement | null>>>({});
  const backRefs = useRef<Partial<Record<GroupKey, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      // Keep keyboard focus on the Close button and the visible view
      if (e.key !== "Tab" || !panelRef.current || !menuRef.current) return;
      const items = [
        menuRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
      ].filter((el) => !el.closest("[inert]"));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
  }, [open]);

  const toggle = () => {
    if (!open) setGroup(null);
    setOpen(!open);
  };
  const close = () => setOpen(false);

  const openGroup = (key: GroupKey) => {
    setGroup(key);
    requestAnimationFrame(() => backRefs.current[key]?.focus({ preventScroll: true }));
  };
  const closeGroup = () => {
    const key = group;
    setGroup(null);
    if (key) requestAnimationFrame(() => groupRefs.current[key]?.focus({ preventScroll: true }));
  };

  return (
    <>
      <header className={styles.header}>
        <a href="#main" className={`${styles.skip} sr-only`}>
          Skip to content
        </a>

        <a href={main.home} className={styles.mark} aria-label="BytesPlatform home">
          BYTES.
        </a>

        <div className={styles.actions}>
          <a href={main.contact} className={`${styles.button} ${styles.action}`}>
            <span className={styles.arrow}>
              <Arrow d={ARROW_IN} />
            </span>
            <span className={styles.label}>Start a project</span>
            <span className={styles.dot} aria-hidden="true" />
          </a>

          <button
            ref={menuRef}
            type="button"
            className={`${styles.button} ${styles.menu}`}
            aria-expanded={open}
            aria-controls="site-menu"
            data-active={open}
            onClick={toggle}
          >
            <span className={styles.label}>{open ? "Close" : "Menu"}</span>
            <span className={styles.menuDots} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <button
          type="button"
          className={styles.backdrop}
          data-open={open}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={close}
        />

        <div
          ref={panelRef}
          id="site-menu"
          className={styles.panelShell}
          data-open={open}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className={styles.panel}>
            <div className={styles.views} data-group={group ?? undefined}>
              <div className={styles.mainView} inert={group !== null}>
                <p className={styles.heading}>Navigation</p>
                <nav className={`${styles.links} ${styles.mainLinks}`} aria-label="Main">
                  {mainNav.map((item, i) => {
                    const style = { "--item-index": i } as CSSProperties;
                    if ("group" in item) {
                      return (
                        <button
                          key={item.label}
                          ref={(el) => {
                            groupRefs.current[item.group] = el;
                          }}
                          type="button"
                          className={`${styles.link} ${styles.groupLink}`}
                          style={style}
                          onClick={() => openGroup(item.group)}
                        >
                          <Roll text={item.label} />
                          <Arrow d={ARROW_IN} />
                        </button>
                      );
                    }
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className={styles.link}
                        style={style}
                        aria-current={item.current ? "page" : undefined}
                        onClick={item.current ? close : undefined}
                      >
                        <Roll text={item.label} />
                        <Arrow d={ARROW_OUT} />
                      </a>
                    );
                  })}
                </nav>
              </div>

              {(Object.keys(groups) as GroupKey[]).map((key) => {
                const g = groups[key];
                const active = group === key;
                let index = 0;
                return (
                  <div key={key} className={styles.subView} data-active={active} inert={!active}>
                    <button
                      ref={(el) => {
                        backRefs.current[key] = el;
                      }}
                      type="button"
                      className={`${styles.heading} ${styles.back}`}
                      onClick={closeGroup}
                    >
                      <Arrow d={ARROW_BACK} />
                      {g.label}
                    </button>
                    <nav className={`${styles.links} ${styles.subLinks}`} aria-label={g.label}>
                      {g.categories.map((cat) => (
                        <div key={cat.title ?? key} className={styles.category}>
                          {cat.title && (
                            <span
                              className={styles.subCategory}
                              style={{ "--sub-index": index } as CSSProperties}
                            >
                              {cat.title}
                            </span>
                          )}
                          {cat.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              className={`${styles.link} ${styles.subLink}`}
                              style={{ "--sub-index": Math.min(index++, 12) } as CSSProperties}
                            >
                              <Roll text={link.label} />
                              <Arrow d={ARROW_OUT} />
                            </a>
                          ))}
                        </div>
                      ))}
                    </nav>
                  </div>
                );
              })}
            </div>

            <div className={styles.bottom}>
              <div className={styles.utilityLinks}>
                {utilityLinks.map((link) => (
                  <a key={link.label} href={link.href}>
                    <Roll text={link.label} />
                  </a>
                ))}
              </div>
              <div className={styles.socials}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* The header floats over the page; this keeps its space in the flow */}
      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}
