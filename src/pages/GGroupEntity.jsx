import { Link, Navigate, useParams } from 'react-router-dom';
import PageShell, { Block, Prose, Ctas } from '../components/PageShell.jsx';
import { G_GROUP, G_GROUP_PATH, CONTACT_PATH, getEntity, entityPath } from '../data/siteMap.js';

export default function GGroupEntity() {
  const { entity: slug } = useParams();
  const entity = getEntity(slug);
  if (!entity) return <Navigate to={G_GROUP_PATH} replace />;

  const others = G_GROUP.entities.filter((e) => e.slug !== entity.slug);
  const ctas = [...(entity.link ? [entity.link] : []), { to: `${CONTACT_PATH}#enquire`, label: 'Contact the Team' }];

  return (
    <PageShell
      active="GGroup"
      eyebrow={entity.area}
      title={entity.name}
      intro={entity.summary}
      crumbs={[{ label: 'G Group', to: G_GROUP_PATH }, { label: entity.name }]}
      seoTitle={`${entity.name} | A G Group Company`}
      description={`Learn about ${entity.name}, its role within the G Group and how to get in touch with the team.`}
    >
      <Block title="Our role in the group">
        <Prose>
          {entity.name} is part of the G Group, a family of companies that each have their own focus and team while supporting the group’s wider objectives.
        </Prose>
      </Block>

      <Block title="Get in touch">
        <div className="mb-10">
          <Prose>For enquiries about {entity.name}, contact our team and we will point you to the right people.</Prose>
        </div>
        <Ctas items={ctas} />
      </Block>

      <Block title="Also in the G Group">
        <ul className="flex flex-wrap gap-3">
          {others.map((e) => (
            <li key={e.slug}>
              <Link to={entityPath(e.slug)} className="inline-block border border-glass-strong px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white/75 hover:text-champagne hover:border-champagne transition-colors">
                {e.name}
              </Link>
            </li>
          ))}
        </ul>
      </Block>
    </PageShell>
  );
}
