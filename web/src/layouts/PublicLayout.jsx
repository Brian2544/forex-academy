import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <PublicNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

