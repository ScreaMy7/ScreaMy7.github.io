// Projects shown on /projects and the home page.
// featured: true → appears on the home page.

export interface Project {
  name: string;
  description: string;
  stack: string[];
  repo?: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'soxtract',
    description:
      'Dynamically extracts native .so libraries from running Android apps with Frida and repairs the dumps into valid ELF binaries, ready for Ghidra, Binary Ninja or IDA Pro.',
    stack: ['Python', 'Frida', 'Android'],
    repo: 'https://github.com/ScreaMy7/soxtract',
    links: [{ label: 'PyPI', href: 'https://pypi.org/project/soxtract/' }],
    featured: true,
  },
  {
    name: 'afl-android-emulator-kernel',
    description:
      'A reproducible, AFL++-ready Android emulator kernel. Rebuilds the goldfish kernel with SysV IPC enabled so stock AVDs can run coverage-guided fuzzing with a single -kernel swap.',
    stack: ['AFL++', 'Shell', 'Docker', 'Android'],
    repo: 'https://github.com/ScreaMy7/afl-android-emulator-kernel',
    featured: true,
  },
  {
    name: 'CLI-MD',
    description:
      'A terminal-native Markdown workspace: renders, watches, searches and link-checks documentation. Built as the human-readable layer for notes and reports produced alongside AI coding agents.',
    stack: ['JavaScript', 'Node.js'],
    repo: 'https://github.com/ScreaMy7/CLI-MD',
    links: [{ label: 'npm', href: 'https://www.npmjs.com/package/@screamy7/cli-md' }],
    featured: true,
  },
  {
    name: 'AI security automation',
    description:
      'Claude Code skills with specialised subagents that orchestrate Android pentest workflows (manifest/IPC analysis, native-code tracing, on-device verification) and JNI fuzzing with AFL++ frida-mode.',
    stack: ['LLM agents', 'Claude Code', 'Python'],
  },
  {
    name: 'JS-mapper-beautifier',
    description: 'Takes JS file links as input and beautifies the files or maps the webpack bundle.',
    stack: ['JavaScript'],
    repo: 'https://github.com/ScreaMy7/JS-mapper-beautifier',
  },
  {
    name: 'Api-Mapper',
    description: 'Visualises API endpoints from Burp Suite history.',
    stack: ['Python', 'Burp Suite'],
    repo: 'https://github.com/ScreaMy7/Api-Mapper',
  },
];

// Open-source contributions shown on /projects and /about.
export const contributions = [
  {
    name: 'OWASP MASTG',
    description:
      'Contributed test cases on Android code security, SSL pinning bypass, IPC hardening and cryptographic flaws.',
    href: 'https://mas.owasp.org/MASTG/',
  },
  {
    name: 'Nuclei Templates (ProjectDiscovery)',
    description: 'CVE detection templates for the community template library.',
    href: 'https://github.com/projectdiscovery/nuclei-templates',
  },
];
