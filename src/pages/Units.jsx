import { Navigate, useParams } from 'react-router-dom';
import PageShell, { Block, Prose, Ctas } from '../components/PageShell.jsx';
import { getProject, projectPath } from '../data/projects.js';
import { COMMUNITY_PATH, CONTACT_PATH } from '../data/siteMap.js';

// Live unit data (Salesforce, via a server-side endpoint) isn't connected yet, so this shows the "unavailable" state
// rather than any price or availability.
export default function Units() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <Navigate to={COMMUNITY_PATH} replace />;

  return (
    <PageShell
      active="Communities"
      eyebrow={project.name}
      title="Explore available property options"
      intro={`Compare the property types listed for ${project.name}. Unit details, availability and prices are subject to confirmation through the current sales inventory.`}
      crumbs={[{ label: 'Communities', to: COMMUNITY_PATH }, { label: project.name, to: projectPath(project.key) }, { label: 'Units' }]}
      seoTitle={`Unit Types and Prices | ${project.name} | G Developments`}
      description={`Review property types at ${project.name} and request current prices, availability, layouts and payment options from G Developments.`}
    >
      <Block title="Unit types & prices">
        <div className="mb-10 flex flex-col gap-5">
          <Prose>We are unable to load live unit information right now. Please try again later or contact our sales team.</Prose>
          <Prose>If you need a floor plan, a full price breakdown or confirmation of availability, submit an enquiry and our sales team will follow up.</Prose>
        </div>
        <Ctas items={[{ to: `${CONTACT_PATH}#enquire`, label: 'Request Current Prices' }, { to: projectPath(project.key), label: 'Back to Project' }]} />
        <p className="mt-12 text-xs font-light text-white/35 max-w-[520px] leading-[1.6]">Prices, availability and terms are subject to confirmation by the company.</p>
      </Block>
    </PageShell>
  );
}
