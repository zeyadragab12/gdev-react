import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Communities from './pages/Communities.jsx';
import Vision from './pages/Vision.jsx';
import Contact from './pages/Contact.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Intro from './components/Intro.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import LeadPopup from './components/LeadPopup.jsx';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Intro onDone={() => setIntroDone(true)} />
      <LeadPopup ready={introDone} />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/vision" element={<Vision />} />
        {/* old URL kept working for existing links */}
        <Route path="/philosophy" element={<Navigate to="/vision" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/communities/:slug" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}
