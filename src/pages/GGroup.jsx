import { Link } from 'react-router-dom';
import PageShell, { Block, Prose } from '../components/PageShell.jsx';
import { G_GROUP } from '../data/siteMap.js';

const linkClass = 'mt-6 inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne border-b border-champagne/40 pb-1 hover:border-champagne transition-colors';

export default function GGroup() {
  return (
    <PageShell
      active="GGroup"
      eyebrow="G Group"
      title={G_GROUP.title}
      intro={G_GROUP.intro}
      crumbs={[{ label: 'G Group' }]}
      seoTitle="G Group | Companies and Capabilities"
      description="Explore the G Group ecosystem, its companies, services and the capabilities that support its business and real estate developments."
    >
      <Block title="Group overview">
        <Prose>{G_GROUP.overview}</Prose>
      </Block>

      {G_GROUP.entities.length > 0 && (
        <Block title="Our companies">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-glass">
            {G_GROUP.entities.map((e) => (
              <li key={e.slug} className="bg-black p-8 md:p-12">
                <div className="text-[11px] tracking-[0.24em] uppercase text-muted mb-5">{e.area}</div>
                <div className="text-2xl font-light mb-3">{e.name}</div>
                <p className="text-[15px] leading-[1.75] text-muted font-light max-w-[440px]">{e.summary}</p>
                {e.link && (
                  e.link.href ? (
                    <a href={e.link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {e.link.label} &rarr;
                    </a>
                  ) : (
                    <Link to={e.link.to} className={linkClass}>
                      {e.link.label} &rarr;
                    </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block title="How the ecosystem works">
        <Prose>{G_GROUP.ecosystem}</Prose>
      </Block>
    </PageShell>
  );
}
