<script setup lang="ts">
import TeamSection from '@/components/blocks/team-section/TeamSection.vue'

const departmentMembers = [
  {
    name: 'Amara Okafor',
    role: 'Co-founder & CEO',
    bio: 'Sets the vision and still reviews every release note before it ships.',
    department: 'Leadership',
    twitter: 'https://x.com/amaraokafor',
    linkedin: 'https://linkedin.com/in/amaraokafor',
  },
  {
    name: 'Jonas Lindqvist',
    role: 'Co-founder & CTO',
    bio: 'Owns architecture and keeps p95 latency under 80ms in every region.',
    department: 'Leadership',
    github: 'https://github.com/jonaslindqvist',
    linkedin: 'https://linkedin.com/in/jonaslindqvist',
  },
  {
    name: 'Priya Raghavan',
    role: 'Staff Engineer',
    bio: 'Leads the platform team and maintains our public REST and GraphQL APIs.',
    department: 'Engineering',
    github: 'https://github.com/priyaraghavan',
  },
  {
    name: 'Felix Adeyemi',
    role: 'Growth Engineer',
    bio: 'Experiments across onboarding and pricing pages; ships behind flags daily.',
    department: 'Engineering',
    twitter: 'https://x.com/felixadeyemi',
  },
  {
    name: 'Ines Moreau',
    role: 'Backend Engineer',
    bio: 'Guards the data model and writes the migrations nobody else wants to touch.',
    department: 'Engineering',
    github: 'https://github.com/inesmoreau',
  },
  {
    name: 'Daniel Kim',
    role: 'Frontend Engineer',
    bio: 'Obsesses over render budgets and keeps the app feeling instant on mid-range phones.',
    department: 'Engineering',
    github: 'https://github.com/danielkim',
    twitter: 'https://x.com/danielkim',
  },
  {
    name: 'Marco Deluca',
    role: 'Product Designer',
    bio: 'Turns messy workflows into calm interfaces and runs our weekly design critique.',
    department: 'Design',
    twitter: 'https://x.com/marcodeluca',
    linkedin: 'https://linkedin.com/in/marcodeluca',
  },
  {
    name: 'Sofia Marchetti',
    role: 'Brand Designer',
    bio: 'Owns the identity system, illustration style and every pixel of the launch pages.',
    department: 'Design',
    linkedin: 'https://linkedin.com/in/sofiamarchetti',
  },
  {
    name: 'Hana Yoshida',
    role: 'UX Researcher',
    bio: 'Runs monthly usability sessions and turns raw notes into a ranked fixes list.',
    department: 'Design',
    linkedin: 'https://linkedin.com/in/hanayoshida',
  },
]

const fourMembers = [
  {
    name: 'Lena Fischer',
    role: 'Head of Support',
    bio: 'Answers every escalation thread and publishes the public incident postmortems.',
    linkedin: 'https://linkedin.com/in/lenafischer',
  },
  {
    name: 'Omar Haddad',
    role: 'DevOps Engineer',
    bio: 'Keeps deploys boring — twelve a day, zero drama, full audit trail.',
    github: 'https://github.com/omarhaddad',
  },
  {
    name: 'Grace Nwosu',
    role: 'Security Engineer',
    bio: 'Runs the SOC 2 program and red-teams our own product every quarter.',
    linkedin: 'https://linkedin.com/in/gracenwosu',
    twitter: 'https://x.com/gracenwosu',
  },
  {
    name: 'Theo Bergström',
    role: 'Data Engineer',
    bio: 'Builds the pipelines behind usage analytics and the weekly metrics digest.',
    github: 'https://github.com/theobergstrom',
  },
]

const longBioMembers = [
  {
    name: 'Priya Raghavan',
    role: 'Staff Engineer',
    bio: 'Priya spends her days deep in the platform codebase and her evenings mentoring first-time contributors. She has shipped production systems for banks, hospitals and two failed startups — which she insists taught her the most.',
    github: 'https://github.com/priyaraghavan',
  },
  {
    name: 'Marco Deluca',
    role: 'Product Designer',
    bio: 'Marco joined after a decade designing enterprise tools nobody enjoyed using. He now runs our weekly design critique, maintains the illustration library, and personally reviews every empty state before it ships to production.',
    twitter: 'https://x.com/marcodeluca',
    linkedin: 'https://linkedin.com/in/marcodeluca',
  },
]

const manyMembers = [
  {
    name: 'Amara Okafor',
    role: 'Co-founder & CEO',
    bio: 'Sets the vision and still reviews every release note.',
    twitter: 'https://x.com/amaraokafor',
  },
  {
    name: 'Jonas Lindqvist',
    role: 'Co-founder & CTO',
    bio: 'Owns architecture and the latency budget.',
    github: 'https://github.com/jonaslindqvist',
  },
  {
    name: 'Priya Raghavan',
    role: 'Staff Engineer',
    bio: 'Leads the platform team and public APIs.',
    github: 'https://github.com/priyaraghavan',
  },
  {
    name: 'Marco Deluca',
    role: 'Product Designer',
    bio: 'Turns messy workflows into calm interfaces.',
    twitter: 'https://x.com/marcodeluca',
  },
  {
    name: 'Tomoko Saito',
    role: 'Head of People',
    bio: 'Builds hiring loops that respect candidates.',
    linkedin: 'https://linkedin.com/in/tomokosaito',
  },
  {
    name: 'Felix Adeyemi',
    role: 'Growth Engineer',
    bio: 'Ships experiments behind flags daily.',
    twitter: 'https://x.com/felixadeyemi',
  },
  {
    name: 'Ines Moreau',
    role: 'Backend Engineer',
    bio: 'Guards the data model and migrations.',
    github: 'https://github.com/inesmoreau',
  },
  {
    name: 'Daniel Kim',
    role: 'Frontend Engineer',
    bio: 'Obsesses over render budgets.',
    github: 'https://github.com/danielkim',
  },
  {
    name: 'Sofia Marchetti',
    role: 'Brand Designer',
    bio: 'Owns the identity system end to end.',
    linkedin: 'https://linkedin.com/in/sofiamarchetti',
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Six stub members in a responsive grid — avatar initials, muted role badge, one-line bio and ghost social buttons."
  >
    <TeamSection />
  </Story>

  <Story
    title="With departments"
    description="When members carry a department field, the grid groups under uppercase Leadership / Engineering / Design headers."
  >
    <TeamSection :members="departmentMembers" />
  </Story>

  <Story title="Compact" description="variant='compact' tightens padding and avatars and drops bios entirely.">
    <TeamSection variant="compact" />
  </Story>

  <Story title="Four members" description="An even 2×2 layout at sm breakpoint — small teams stay balanced.">
    <TeamSection :members="fourMembers" />
  </Story>

  <Story title="Long bios" description="Bios clamp to two lines so one verbose member can't stretch the whole row.">
    <TeamSection :members="longBioMembers" />
  </Story>

  <Story title="Many members" description="Nine flat members fill all three columns twice without grouping.">
    <TeamSection :members="manyMembers" />
  </Story>

  <Story title="No header" description="Pass empty eyebrow/title/description strings to render just the grid.">
    <TeamSection eyebrow="" title="" description="" :members="fourMembers" />
  </Story>

  <Story title="Custom copy" description="Eyebrow, headline and lede are plain props — rewrite them per page.">
    <TeamSection
      eyebrow="Careers"
      title="Work with people who sweat the details"
      description="We hire slowly and on-ramp carefully. Every opening below pairs with a take-home that mirrors real work."
      :members="fourMembers"
    />
  </Story>
</template>
