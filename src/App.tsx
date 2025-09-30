import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import Preview from './pages/Preview';
// import Admin from './pages/Admin';
import FallingHeartsWebsite from './pages/FallingHeartsWebsite';
import Template from "@/pages/Template.tsx";
import BuyKey from "@/pages/BuyKey.tsx";
import VNPReturnPage from "@/pages/VNPReturnPage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/template" element= {<Template />} />
                <Route path="/buykey" element= {<BuyKey />} />
                <Route path="/preview" element={<Preview />} />
                <Route path="/project/:id" element={<FallingHeartsWebsite />} />
                <Route path="/vnpreturn" element={<VNPReturnPage />} />
                {/*<Route path="/admin" element= {<Admin />} />*/}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;