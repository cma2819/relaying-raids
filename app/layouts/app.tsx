import { Outlet } from 'react-router';
import { Head } from '../common/head';
import { Notifications } from '@mantine/notifications';

export default function ApplicationLayout() {
  return (
    <>
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
          <header className="flex flex-col items-center gap-4">
            <Head level="h1">
              Twitch Relaying Raids
            </Head>
          </header>
          <div className="w-full space-y-6 px-4">
            <Outlet />
          </div>
        </div>
      </main>
      <Notifications position="top-right" />
    </>
  );
}
