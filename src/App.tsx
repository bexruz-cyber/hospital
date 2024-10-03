import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Home from './components/home';
import Department from './components/department';
import { Toaster } from './components/ui/toaster';
import Top_navbar from './components/header';
import Rooms from './components/rooms';
import Spec from './components/spec';
import Doctor from './components/doctor';
import Position from './components/position';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showNavbar = ['/','/department', '/rooms', '/spec', '/doctor', '/position'].includes(location.pathname);

  return (
    <div className='h-screen max-w-[1540px] px-5 mx-auto'>
      {showNavbar && <Top_navbar />}
      {children}
      <Toaster />
    </div>
  );
};

// PrivateRoute komponenti
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const authToken = localStorage.getItem('authToken');
  
  // Agar authToken mavjud bo'lsa, sahifani ko'rsatamiz, aks holda ro'yxatdan o'tish sahifasiga yo'naltiramiz
  return authToken ? element : <Navigate to="/register" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
      <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      <Route path="/department" element={<AppLayout><PrivateRoute element={<Department />} /></AppLayout>} />
      <Route path="/rooms" element={<AppLayout><PrivateRoute element={<Rooms />} /></AppLayout>} />
      <Route path="/spec" element={<AppLayout><PrivateRoute element={<Spec />} /></AppLayout>} />
      <Route path="/doctor" element={<AppLayout><PrivateRoute element={<Doctor />} /></AppLayout>} />
      <Route path="/position" element={<AppLayout><PrivateRoute element={<Position />} /></AppLayout>} />
    </Routes>
  );
}

export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}
