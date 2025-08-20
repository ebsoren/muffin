import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './components/ThemeProvider';
import { NavBar } from './components/NavBar/NavBar';
import { About } from './pages/About/About';
import { Events } from './pages/Events/Events';
import { Join } from './pages/Join/Join';
import { Home } from './pages/Home/Home';
import { Admin } from './pages/Admin/Admin';
import { Members } from './pages/Members/Members';
import { AuthCallback } from './pages/AuthCallback/AuthCallback';
import Footer from './components/Footer/Footer';
import { useAuth } from './hooks/useAuth';
import { NotFound } from './pages/NotFound/NotFound';

function AppContent() {
  // Check authentication on app startup
  useAuth();

  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-custom-black duration-200">
      <NavBar />
      <main className="flex justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/join" element={<Join />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/members" element={<Members />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
