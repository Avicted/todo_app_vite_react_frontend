import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Todos from './features/todo/TodosPage';
import { HomePage } from './features/homepage/home';
import Layout from './Layout';
import AuthenticationPage from './features/authentication/AuthenticationPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/authentication" element={<AuthenticationPage />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
