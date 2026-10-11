import { Link } from 'react-router-dom';
import PageShell, { Block, Prose, Ctas } from '../components/PageShell.jsx';
import { ABOUT_PAGES, aboutPath, COMMUNITY_PATH, CONTACT_PATH, G_GROUP_PATH } from '../data/siteMap.js';

const EXPLORE = [...ABOUT_PAGES.map((p) => ({ to: aboutPath(p.slug), label: p.label, text: p.summary })), { to: G_GROUP_PATH, label: 'G Group', text: 'Explore the companies and capabilities connected to our wider group.' }];

export default function AboutUs() {
  return (
    <PageShell
      active="About"
      eyebrow="About Us"
      title="Building places for life to move forward"
      intro="At G Developments, we focus on creating places where people can live, connect and plan for what comes next. Our work brings together real estate development, customer needs and a long-term view of community living."
      crumbs={[{ label: 'About Us' }]}
      seoTitle="About G Developments | Our Group, People and Communities"
      description="Learn about G Developments, our story, leadership, values and approach to creating communities. Explore our group companies and real estate projects."
    >
      <Block title="A connected approach to development">
        <Prose>
          Every development begins with an understanding of the people it will serve. We consider location, planning, design, amenities and the everyday experience of residents when shaping our projects. Across our business, we aim to make the journey from choosing a home to living in a community clear, considered and customer-focused.
        </Prose>
      </Block>

      <Block title="Explore the group" className="!py-0">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-glass -mx-5 md:-mx-16">
          {EXPLORE.map((p, i) => (
            <li key={p.to} className="bg-black">
              <Link to={p.to} className="group block p-8 md:p-12 h-full transition-colors hover:bg-white/[0.03]">
                <div className="text-[15px] font-light text-muted mb-6">{String(i + 1).padStart(2, '0')}</div>
                <div className="text-2xl font-light mb-3 group-hover:text-champagne transition-colors">{p.label}</div>
                <p className="text-[15px] leading-[1.75] text-muted font-light max-w-[440px]">{p.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Find a place that fits your next chapter.">
        <div className="mb-10">
          <Prose>Explore our communities, compare available property types and request current information from our sales team.</Prose>
        </div>
        <Ctas items={[{ to: COMMUNITY_PATH, label: 'Explore Our Communities' }, { to: CONTACT_PATH, label: 'Contact Our Team' }]} />
      </Block>
    </PageShell>
  );
}
