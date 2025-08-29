import { Outlet } from 'react-router';
import { Navigation } from '../concerns/common/navigation';

export default function WithNavigationLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}
