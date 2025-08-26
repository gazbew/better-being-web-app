import { Outlet } from 'react-router-dom';
import NavigationPrimary from '@/components/NavigationPrimary';
import FooterPrimary from '@/components/FooterPrimary';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationPrimary />
      <div className="flex-1">
        <Outlet />
      </div>
      <FooterPrimary />
    </div>
  );
}
