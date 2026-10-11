import PageShell, { Block, Prose, Ctas } from '../components/PageShell.jsx';
import { COMMUNITY_PATH } from '../data/siteMap.js';

export default function NotFound() {
  return (
    <PageShell title="Page not found" seoTitle="Page not found | G Developments">
      <Block>
        <div className="mb-10">
          <Prose>We could not find the page you were looking for. The page might have moved or the link might be incorrect.</Prose>
        </div>
        <Ctas items={[{ to: '/', label: 'Back to Home' }, { to: COMMUNITY_PATH, label: 'Explore Communities' }]} />
      </Block>
    </PageShell>
  );
}
