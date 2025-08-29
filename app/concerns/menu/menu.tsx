import { ListBulletIcon } from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { Link } from 'react-router';
import { Paper } from '~/concerns/common/paper';

type ItemProps = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href: string;
};

function MenuItem({ icon, label, description, href }: ItemProps) {
  return (
    <Link to={{
      pathname: href,
    }}
    >
      <div className="flex items-center gap-2 p-2 hover:bg-gray-100">
        {icon}
        <div className="flex flex-col">
          <span className="font-semibold">{label}</span>
          {description && <span className="text-sm text-gray-500">{description}</span>}
        </div>
      </div>
    </Link>
  );
}

export function Menu() {
  return (
    <Paper>
      <div className="flex flex-col w-full min-w-2xl">
        <MenuItem icon={<PencilSquareIcon className="size-9" />} label="レイドリレーをつくる" description="新しくレイドリレーを作成します" href="/events/-/new" />
        <MenuItem icon={<ListBulletIcon className="size-9" />} label="つくったリレーを確認する" description="リレーへの参加者登録、リレーの編集をします" href="/events" />
        <MenuItem icon={<FlagIcon className="size-9" />} label="リレーに参加する" description="登録済みのリレーに参加します" href="/participate" />
      </div>
    </Paper>
  );
}
