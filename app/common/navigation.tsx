import { ListBulletIcon } from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { Link } from 'react-router';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

function NavItem({ icon, label, href }: NavItemProps) {
  return (
    <Link to={href} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
      <div className="w-5 h-5">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function Navigation() {
  return (
    <div className="flex justify-center">
      <nav className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-center gap-4 px-4 py-2">
          <NavItem icon={<HomeIcon />} label="ホーム" href="/" />
          <NavItem icon={<PencilSquareIcon />} label="レイドリレーをつくる" href="/events/-/new" />
          <NavItem icon={<ListBulletIcon />} label="つくったリレーを確認する" href="/events" />
          <NavItem icon={<FlagIcon />} label="リレーに参加する" href="/participate" />
        </div>
      </nav>
    </div>
  );
}
