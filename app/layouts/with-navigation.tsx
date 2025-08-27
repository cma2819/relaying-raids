import { Outlet } from 'react-router';
import { Navigation } from '../common/navigation';

export default function WithNavigationLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}
