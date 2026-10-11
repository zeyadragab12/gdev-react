// Single source of truth for the About Us / G Group page tree — Nav, Footer, hubs and routes all read this.
// Copy comes from G_Developments_Website_Content_Master.docx (draft copy: facts marked unverified there are left out, not guessed).
import { FOUNDED_YEAR } from './company.js';

export const COMMUNITY_PATH = '/community';
export const LATEST_LAUNCHES_PATH = '/community/latest-launches';
export const G_GROUP_PATH = '/g-group';
export const CONTACT_PATH = '/contact';

export const ABOUT_PAGES = [
  {
    slug: 'history',
    label: 'Our Story',
    title: 'Our story is still being written',
    summary: 'Learn about the milestones that have shaped G Developments.',
    intro: 'G Developments’ story is shaped by a commitment to real estate, customer relationships and the places people call home. Each stage of our journey reflects lessons learned, new ambitions and a continuing focus on the needs of our customers and communities.',
    description: 'Explore the story of G Developments, the milestones behind our growth and the ideas that continue to shape our communities.',
    seoTitle: 'Our Story | G Developments',
  },
  {
    slug: 'vision-mission',
    label: 'Vision, Mission & Values',
    title: 'The principles behind every decision',
    summary: 'Read about the principles that guide our decisions.',
    intro: 'Our vision sets our direction. Our mission guides our work. Our values shape how we work with customers, colleagues, partners and the communities around our projects.',
    description: 'Read the vision, mission and values that guide G Developments’ decisions, relationships and approach to real estate development.',
    seoTitle: 'Vision, Mission and Values | G Developments',
  },
  {
    slug: 'board',
    label: 'Board Members',
    title: 'Governance and strategic oversight',
    summary: 'Meet the board responsible for governance and strategic oversight.',
    intro: 'The Board provides oversight and direction for the company’s long-term priorities. Its responsibilities include reviewing strategy, monitoring performance, overseeing risk and supporting responsible decision-making in line with the company’s governance framework.',
    description: 'Meet the board members responsible for governance, strategic oversight and supporting the long-term direction of G Developments.',
    seoTitle: 'Board Members | G Developments',
  },
  {
    slug: 'executive-team',
    label: 'Executive Team',
    title: 'The people turning plans into progress',
    summary: 'Get to know the leaders responsible for business operations and delivery.',
    intro: 'Our executive team leads the day-to-day work behind our business, coordinating people, expertise and resources to move projects forward and serve customers.',
    description: 'Meet the leadership team guiding G Developments’ strategy, operations, project delivery and customer experience.',
    seoTitle: 'Executive Team | G Developments',
  },
  {
    slug: 'sustainability',
    label: 'CSR & Sustainability',
    title: 'Responsible development starts with thoughtful choices',
    summary: 'Learn about our approach to responsible business and community impact.',
    intro: 'The places we develop influence the daily lives of residents, workers, visitors and surrounding communities. We aim to consider these relationships throughout planning, construction and operation, while working within applicable regulations and the requirements of each project.',
    description: 'Learn about G Developments’ approach to responsible business, community engagement, environmental awareness and sustainable development.',
    seoTitle: 'CSR and Sustainability | G Developments',
  },
];

export const aboutPath = (slug) => (slug ? `/about-us/${slug}` : '/about-us');
export const getAboutPage = (slug) => ABOUT_PAGES.find((p) => p.slug === slug);

// Page bodies. Facts here were confirmed by the client (content master + New Giza profile report).
export const HISTORY = {
  milestones: [
    { year: String(FOUNDED_YEAR), title: 'The beginning', text: 'The company was established as New Giza Development by Mahmoud El-Gamal and Salah Diab, with a focus on residential and commercial development in Egypt. Its first and defining project was New Giza, a landscaped community in 6th of October City.' },
    { year: '2016', title: 'University of New Giza', text: 'New Giza expanded beyond housing into education with the opening of the University of New Giza.' },
    { year: '2019', title: 'Investing in education', text: 'The company made a major investment to expand the university, reinforcing its belief that a community is more than its homes.' },
    { year: '2024', title: 'A new name: G Developments', text: 'In August 2024, New Giza Development was renamed G Developments. The new name reflects a company whose communities now reach well beyond a single address, across Cairo, the North Coast, Ras El Hekma and Ain Sokhna.', note: 'Renamed in August 2024' },
    { year: 'Today', title: 'Communities across Egypt', text: 'G Developments continues to develop New Giza alongside NewKairo, City View, Seashell, Playa and Ain Bay, each planned around landscape, open space and long-term living.' },
  ],
  journey: 'From a first community in 6th of October City, G Developments has grown into a developer with communities in Cairo, on the North Coast, at Ras El Hekma and in Ain Sokhna. Our history is best understood through the milestones that have shaped our business.',
  portfolio: [
    { title: 'New Giza', text: 'Our flagship master-planned community in 6th of October City: 1,500 acres, 87% of it planned as open space, gardens and lakes, with an 18-hole golf course and a downtown district.' },
    { title: 'Education', text: 'The University of New Giza, opened in 2016, reflects our interest in building the institutions that communities depend on.' },
    { title: 'Coastal living', text: 'Seashell, Playa and Ain Bay extend our work to the Mediterranean and Red Sea coasts.' },
    { title: 'Urban residences', text: 'NewKairo and City View bring community-scale planning to Cairo’s established and growing neighbourhoods.' },
  ],
  founders: [{ name: 'Mahmoud El-Gamal', role: 'Co-founder' }, { name: 'Salah Diab', role: 'Co-founder' }],
  ahead: 'As we move forward, we remain focused on understanding changing customer expectations, developing thoughtfully planned communities and strengthening the capabilities needed to deliver on our commitments.',
};

export const VISION = {
  vision: 'To create places and communities that people value today and feel confident choosing for the future.',
  mission: 'To develop considered real estate destinations by bringing together thoughtful planning, customer understanding, responsible execution and long-term relationships.',
  values: [
    { title: 'Customer focus', text: 'We listen carefully, communicate clearly and work to understand what matters to the people who choose our developments.' },
    { title: 'Integrity', text: 'We aim to communicate honestly, act responsibly and make decisions in line with our commitments and applicable requirements.' },
    { title: 'Quality', text: 'We pay attention to planning, design, execution and the details that influence the customer experience.' },
    { title: 'Accountability', text: 'We take ownership of our responsibilities, follow through on commitments and learn from feedback.' },
    { title: 'Collaboration', text: 'We value the contribution of colleagues, consultants, contractors, partners and customers.' },
    { title: 'Long-term thinking', text: 'We consider how decisions affect residents, communities, business partners and the future use of each development.' },
  ],
  practice: [
    'Set clear expectations and explain project information in accessible language.',
    'Maintain defined processes for customer enquiries, feedback and follow-up.',
    'Coordinate across teams and partners throughout the project lifecycle.',
    'Review performance and use feedback to improve the customer experience.',
    'Follow applicable laws, regulations, safety requirements and company policies.',
  ],
};

export const GOVERNANCE =
  'G Developments aims to maintain clear responsibilities, appropriate oversight and accountable decision-making. The company’s governance practices are designed to support its business strategy, meet applicable legal requirements and protect the interests of relevant stakeholders.';

export const LEADERS = [
  { name: 'Mahmoud El-Gamal', role: 'Co-founder' },
  { name: 'Salah Diab', role: 'Co-founder' },
];

export const TEAM_NOTE =
  'Real estate development depends on coordination across planning, design, construction, commercial operations, customer service and support functions. Our leadership team works across these areas to align priorities, monitor progress and address issues with clear ownership.';

export const SUSTAINABILITY = {
  approach: [
    { title: 'Community engagement', text: 'We value respectful communication with residents, customers, local stakeholders and partners.' },
    { title: 'Environmental awareness', text: 'We seek to understand the environmental considerations relevant to each project and to apply approved measures where appropriate.' },
    { title: 'Health and safety', text: 'We expect relevant teams and contractors to follow applicable health and safety requirements and the project-specific procedures in place.' },
    { title: 'Ethical business', text: 'We aim to conduct business responsibly, with clear expectations for employees, suppliers and business partners.' },
    { title: 'People and opportunity', text: 'Our people and partners contribute to the quality of our work.' },
  ],
  certifications: ['ISO 9001', 'LEED', 'OHSAS 18001'],
  green: 'At New Giza, 87% of the land is planned as open space, gardens and lakes, so greenery is part of every neighbourhood rather than an afterthought.',
  commitments: 'We believe responsible business requires clear priorities and honest reporting. As our programmes develop, we will share verified initiatives, progress measures and relevant updates through this page.',
};

export const G_GROUP = {
  title: 'A group of capabilities, connected by a shared direction',
  intro: 'The G Group ecosystem brings together businesses and capabilities that support its wider objectives. Explore the companies below to understand their individual roles, expertise and relationship to the group.',
  overview: 'Each company has its own area of focus, team and responsibilities, and together they support the group’s wider objectives.',
  ecosystem: 'The group’s structure is designed to make each company’s role clear while supporting coordination where business needs overlap.',
  // Names confirmed by the client. Summaries are deliberately general (derived from each name only) — replace with
  // approved descriptions, services and logos per entity. Cards, nav and /g-group/:entity pages all read this.
  entities: [
    { slug: 'g-developments', name: 'G Developments', area: 'Real estate development', summary: 'The group’s real estate developer, creating master-planned communities across Egypt.', link: { to: COMMUNITY_PATH, label: 'Explore Our Communities' } },
    { slug: 'g-communities', name: 'G Communities', area: 'Community living', summary: 'Focused on the everyday life of the communities in the G Group.' },
    { slug: 'g-lifestyle', name: 'G Lifestyle', area: 'Lifestyle', summary: 'Lifestyle experiences and services for residents and visitors.' },
    { slug: 'g-hotels', name: 'G Hotels', area: 'Hospitality', summary: 'The group’s hospitality business.' },
    { slug: 'g-clubs', name: 'G Clubs', area: 'Clubs and leisure', summary: 'Club and leisure facilities within the group’s communities.' },
    { slug: 'g-utilities', name: 'G Utilities', area: 'Utilities and infrastructure', summary: 'Utilities and infrastructure services that support the group’s communities.' },
    { slug: 'g-investments', name: 'G Investments', area: 'Investments', summary: 'The group’s investment arm.' },
    { slug: 'builddora', name: 'BuildDora', area: 'Building', summary: 'A member company of the G Group.' },
  ],
};

export const getEntity = (slug) => G_GROUP.entities.find((e) => e.slug === slug);
export const entityPath = (slug) => `${G_GROUP_PATH}/${slug}`;
