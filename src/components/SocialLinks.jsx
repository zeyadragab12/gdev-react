// Official G Developments social profiles, used in the footer and on the Contact page.
const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://eg.linkedin.com/company/middle-east-for-investment-toursitic-development',
    icon: (
      <path d="M4 9h3v11H4zM5.5 4a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.5c.5-.9 1.7-1.8 3.4-1.8 3.1 0 3.7 2 3.7 4.7V20h-3v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20h-3z" fill="currentColor" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/g___developments/',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/TheGdev/',
    icon: (
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.8.3-1.4 1.4-1.4h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7z" fill="currentColor" />
    ),
  },
];

export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`G Developments on ${s.label}`}
          className="group relative w-12 h-12 rounded-full border border-glass-strong flex items-center justify-center overflow-hidden transition-colors duration-500 hover:border-champagne"
        >
          <span className="absolute inset-0 bg-champagne scale-0 rounded-full transition-transform duration-500 group-hover:scale-100" />
          <svg viewBox="0 0 24 24" className="relative w-[18px] h-[18px] text-white/80 transition-colors duration-500 group-hover:text-black">
            {s.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
