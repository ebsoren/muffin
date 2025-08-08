import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './components/ThemeProvider';
import { NavBar } from './components/NavBar/NavBar';
import { About } from './pages/About/About';
import { Events } from './pages/Events/Events';
import { Join } from './pages/Join/Join';
import { Home } from './pages/Home/Home';
import Footer from './components/Footer/Footer';

function AppContent() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-custom-black duration-200">
      <NavBar />
      <main className="flex justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/join" element={<Join />} />
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
