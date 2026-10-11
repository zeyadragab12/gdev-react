import { Navigate, useParams } from 'react-router-dom';
import PageShell, { Block, Prose, CardGrid, Ctas } from '../components/PageShell.jsx';
import StoryTimeline from '../components/StoryTimeline.jsx';
import { getAboutPage, HISTORY, LEADERS, GOVERNANCE, TEAM_NOTE, SUSTAINABILITY, COMMUNITY_PATH, CONTACT_PATH } from '../data/siteMap.js';

const CTAS = [{ to: COMMUNITY_PATH, label: 'Explore Our Projects' }, { to: CONTACT_PATH, label: 'Contact Our Team' }];

function History() {
  return (
    <>
      <Block title="The journey">
        <Prose>{HISTORY.journey}</Prose>
      </Block>
      <Block title="Our story, year by year">
        <StoryTimeline items={HISTORY.milestones} />
      </Block>
      <Block title="What we have built">
        <CardGrid items={HISTORY.portfolio} />
      </Block>
      <Block title="Founders">
        <PeopleList people={HISTORY.founders} />
      </Block>
      <Block title="Looking ahead">
        <div className="mb-10"><Prose>{HISTORY.ahead}</Prose></div>
        <Ctas items={CTAS} />
      </Block>
    </>
  );
}

function PeopleList({ people }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-glass max-w-[720px]">
      {people.map((p) => (
        <li key={p.name} className="bg-black p-8">
          <div className="text-xl font-light">{p.name}</div>
          <div className="mt-2 text-[11px] tracking-[0.24em] uppercase text-muted">{p.role}</div>
        </li>
      ))}
    </ul>
  );
}

function Board() {
  return (
    <Block title="Governance">
      <Prose>{GOVERNANCE}</Prose>
    </Block>
  );
}

function Executives() {
  return (
    <>
      <Block title="Leadership">
        <PeopleList people={LEADERS} />
      </Block>
      <Block title="How the team works">
        <Prose>{TEAM_NOTE}</Prose>
      </Block>
      <Block>
        <Ctas items={CTAS} />
      </Block>
    </>
  );
}

function Sustainability() {
  return (
    <>
      <Block title="Our approach">
        <CardGrid items={SUSTAINABILITY.approach} />
      </Block>
      <Block title="Green by design">
        <Prose>{SUSTAINABILITY.green}</Prose>
      </Block>
      <Block title="Certifications">
        <ul className="flex flex-wrap gap-3">
          {SUSTAINABILITY.certifications.map((c) => (
            <li key={c} className="border border-glass-strong px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-champagne">{c}</li>
          ))}
        </ul>
      </Block>
      <Block title="Our commitments and progress">
        <Prose>{SUSTAINABILITY.commitments}</Prose>
      </Block>
    </>
  );
}

const BODIES = { history: History, board: Board, 'executive-team': Executives, sustainability: Sustainability };

export default function AboutSection() {
  const { section } = useParams();
  const page = getAboutPage(section);
  if (!page) return <Navigate to="/about-us" replace />;
  const Body = BODIES[section];

  return (
    <PageShell
      active="About"
      eyebrow="About Us"
      title={page.title}
      intro={page.intro}
      crumbs={[{ label: 'About Us', to: '/about-us' }, { label: page.label }]}
      seoTitle={page.seoTitle}
      description={page.description}
    >
      {Body && <Body />}
    </PageShell>
  );
}
