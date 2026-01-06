import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <PublicNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

