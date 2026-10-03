// Site-wide settings. Edit these in one place.

export const SITE = {
  title: 'Aadarsh Anand',
  handle: 'ScreaMy7',
  description:
    'Security researcher focused on Android, native code and fuzzing. Research, writeups and tools by Aadarsh Anand (ScreaMy7).',
  url: 'https://screamy7.github.io',
  email: 'zoroanandadarsh@gmail.com',
};

export const NAV = [
  { href: '/blog/', label: 'Blog' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
];

// Leave a value empty ('') to hide that link.
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/ScreaMy7' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aadarsh-anand' },
  { label: 'HackerOne', href: '' },
  { label: 'X', href: '' },
].filter((s) => s.href);
