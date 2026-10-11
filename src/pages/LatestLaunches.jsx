import PageShell, { Block, Prose, Ctas } from '../components/PageShell.jsx';
import { COMMUNITY_PATH, CONTACT_PATH } from '../data/siteMap.js';

// No project carries a verified launch date/status yet, so the empty state shows (per the content doc: never label old projects "new").
export default function LatestLaunches() {
  return (
    <PageShell
      active="Communities"
      eyebrow="Communities"
      title="Explore our latest launches"
      intro="Discover the newest projects and releases from G Developments. Review the information available for each launch, including its location, property types and how to request current details from our team."
      crumbs={[{ label: 'Communities', to: COMMUNITY_PATH }, { label: 'Latest Launches' }]}
      seoTitle="Latest Real Estate Launches | G Developments"
      description="View the latest verified real estate launches from G Developments and explore project locations, property types and enquiry details."
    >
      <Block title="Latest launches">
        <div className="mb-10">
          <Prose>There are no new launches to display at the moment. Explore our existing communities or contact our team for current project information.</Prose>
        </div>
        <Ctas items={[{ to: COMMUNITY_PATH, label: 'View All Communities' }, { to: CONTACT_PATH, label: 'Contact Our Team' }]} />
      </Block>
    </PageShell>
  );
}
