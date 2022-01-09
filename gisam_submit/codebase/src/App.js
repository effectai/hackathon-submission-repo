import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Base } from './component/Base';
import './i18n';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Base />} />
        <Route path="/campaign" element={<Base page="campaign" />} />
        <Route path="/create" element={<Base page="create" />} />
        <Route path="/result" element={<Base page="result" />} />
        <Route path="/currentcampaign" element={<Base page="currentcampaign" />} />
        <Route path="/campaigncreatordetail/:id" element={<Base page="campaigncreatordetail" />} />
        <Route path="/campaignworker/:id" element={<Base page="campaignworker" />} />
      </Routes>
    </Router>
  );
}

export default App;
