import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import Preview from './pages/Preview';
import Admin from './pages/Admin';
import FallingHeartsWebsite from './pages/FallingHeartsWebsite';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/preview" element={<Preview />} />
                <Route path="/project/:id" element={<FallingHeartsWebsite />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;