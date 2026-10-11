import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Communities from './pages/Communities.jsx';
import Vision from './pages/Vision.jsx';
import Contact from './pages/Contact.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AboutUs from './pages/AboutUs.jsx';
import AboutSection from './pages/AboutSection.jsx';
import GGroup from './pages/GGroup.jsx';
import GGroupEntity from './pages/GGroupEntity.jsx';
import LatestLaunches from './pages/LatestLaunches.jsx';
import Units from './pages/Units.jsx';
import NotFound from './pages/NotFound.jsx';
import Intro from './components/Intro.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import LeadPopup from './components/LeadPopup.jsx';

// dev-only tool for lining master plans up with the satellite map; never part of a production build
const Calibrate = import.meta.env.DEV ? lazy(() => import('./pages/dev/Calibrate.jsx')) : null;

const MasterPlanEditor = import.meta.env.DEV ? lazy(() => import('./pages/dev/MasterPlanEditor.jsx')) : null;

const ProjectEditor = import.meta.env.DEV ? lazy(() => import('./pages/dev/ProjectEditor.jsx')) : null;
const MasterPlanStyles = import.meta.env.DEV ? lazy(() => import('./pages/dev/MasterPlanStyles.jsx')) : null;

const HomeMapStyles = import.meta.env.DEV ? lazy(() => import('./pages/dev/HomeMapStyles.jsx')) : null;

// keeps old /communities/:slug links (and their #hash) working
function LegacyCommunityRedirect() {
  const { slug } = useParams();
  const { hash } = useLocation();
  return <Navigate to={`/community/${slug}${hash}`} replace />;
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const { pathname } = useLocation();
  const devTool = import.meta.env.DEV && pathname.startsWith('/dev/');

  return (
    <>
      {!devTool && <Intro onDone={() => setIntroDone(true)} />}
      {!devTool && <LeadPopup ready={introDone} />}
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/about-us/vision-mission" element={<Vision />} />
        <Route path="/about-us/:section" element={<AboutSection />} />
        <Route path="/g-group" element={<GGroup />} />
        <Route path="/g-group/:entity" element={<GGroupEntity />} />
        <Route path="/community" element={<Communities />} />
        <Route path="/community/latest-launches" element={<LatestLaunches />} />
        <Route path="/community/:slug" element={<ProjectDetail />} />
        <Route path="/community/:slug/units" element={<Units />} />
        <Route path="/contact" element={<Contact />} />
        {/* old URLs kept working for existing links */}
        <Route path="/vision" element={<Navigate to="/about-us/vision-mission" replace />} />
        <Route path="/philosophy" element={<Navigate to="/about-us/vision-mission" replace />} />
        <Route path="/communities" element={<Navigate to="/community" replace />} />
        <Route path="/communities/:slug" element={<LegacyCommunityRedirect />} />
        {Calibrate && (<Route path="/dev/calibrate" element={<Suspense fallback={null}><Calibrate /></Suspense>} />)}
        {MasterPlanEditor && (<Route path="/dev/masterplan-editor" element={<Suspense fallback={null}><MasterPlanEditor /></Suspense>} />)}
        {ProjectEditor && (<Route path="/dev/projects" element={<Suspense fallback={null}><ProjectEditor /></Suspense>} />)}
        {MasterPlanStyles && (<Route path="/dev/masterplan-styles" element={<Suspense fallback={null}><MasterPlanStyles /></Suspense>} />)}
        {HomeMapStyles && (<Route path="/dev/home-map-styles" element={<Suspense fallback={null}><HomeMapStyles /></Suspense>} />)}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
