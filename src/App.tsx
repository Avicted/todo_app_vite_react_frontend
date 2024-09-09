import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import AuthenticationPage from './features/authentication/AuthenticationPage';
import Login from './features/authentication/Login';
import Register from './features/authentication/Register';
import { HomePage } from './features/homepage/home';
import Todos from './features/todo/TodosPage';
import ErrorBoundary from './components/ErrorBoundry';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/authentication" element={<AuthenticationPage />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/todos" element={<Todos />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
