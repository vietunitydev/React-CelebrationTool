import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProjectList from './pages/ProjectList';
import LessonList from './pages/LessonList';
import WordList from './pages/WordList';
import GameView from './pages/GameView';
import GameResults from './pages/GameResults';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <Layout>
                                <ProtectedRoute element={<Home />} />
                            </Layout>
                        }
                    />

                    <Route
                        path="/vocab-test"
                        element={
                            <Layout>
                                <ProtectedRoute element={<ProjectList />} />
                            </Layout>
                        }
                    />

                    <Route
                        path="/vocab-test/project/:projectId"
                        element={
                            <Layout>
                                <ProtectedRoute element={<LessonList />} />
                            </Layout>
                        }
                    />

                    <Route
                        path="/vocab-test/project/:projectId/lesson/:lessonId"
                        element={
                            <Layout>
                                <ProtectedRoute element={<WordList />} />
                            </Layout>
                        }
                    />

                    <Route
                        path="/vocab-test/project/:projectId/lesson/:lessonId/game"
                        element={
                            <Layout>
                                <ProtectedRoute element={<GameView />} />
                            </Layout>
                        }
                    />

                    <Route
                        path="/vocab-test/project/:projectId/lesson/:lessonId/results"
                        element={
                            <Layout>
                                <ProtectedRoute element={<GameResults />} />
                            </Layout>
                        }
                    />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;