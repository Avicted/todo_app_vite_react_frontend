import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { IUser } from './features/authentication/authenticationSlice';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Layout from './Layout';
import AuthenticationPage from './features/authentication/AuthenticationPage';
import Login from './features/authentication/Login';
import Register from './features/authentication/Register';
import { HomePage } from './features/homepage/home';
import Todos from './features/todo/TodosPage';


export function decodeToken(token: string): IUser | null {
  try {
    const decoded = jwtDecode<IUser>(token);

    console.log('Decoded token:', decoded);

    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}


function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
