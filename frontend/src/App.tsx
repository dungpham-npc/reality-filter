import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { BowlProvider } from './context/BowlContext';
import HazardWarning from './pages/HazardWarning';
import ComfortBait from './pages/ComfortBait';
import HiddenFailure from './pages/HiddenFailure';
import Reveal from './pages/Reveal';
import Fork from './pages/Fork';
import Readings from './pages/Readings';
import Workbench from './pages/Workbench';
import BowlLogin from './pages/bowl/BowlLogin';
import EntryList from './pages/bowl/EntryList';
import EntryEditor from './pages/bowl/EntryEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Hazard System (user-facing) */}
        <Route path="/" element={
          <SessionProvider><HazardWarning /></SessionProvider>
        } />
        <Route path="/phase/comfort-bait" element={
          <SessionProvider><ComfortBait /></SessionProvider>
        } />
        <Route path="/phase/hidden-failure" element={
          <SessionProvider><HiddenFailure /></SessionProvider>
        } />
        <Route path="/phase/reveal" element={
          <SessionProvider><Reveal /></SessionProvider>
        } />
        <Route path="/phase/fork" element={
          <SessionProvider><Fork /></SessionProvider>
        } />
        <Route path="/readings" element={
          <SessionProvider><Readings /></SessionProvider>
        } />
        <Route path="/workbench" element={
          <SessionProvider><Workbench /></SessionProvider>
        } />

        {/* Soup Bowl (creator-facing) */}
        <Route path="/bowl" element={
          <BowlProvider><BowlLogin /></BowlProvider>
        } />
        <Route path="/bowl/entries" element={
          <BowlProvider><EntryList /></BowlProvider>
        } />
        <Route path="/bowl/entries/:id" element={
          <BowlProvider><EntryEditor /></BowlProvider>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
