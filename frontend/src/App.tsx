import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Login } from './pages/Login/Login';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
