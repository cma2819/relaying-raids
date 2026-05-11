import { FlagIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { Link } from 'react-router';
import { Paper } from '~/concerns/common/paper';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

type ItemProps = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href: string;
};

function MenuItem({ icon, label, description, href }: ItemProps) {
  return (
    <Link
      to={{
        pathname: href,
      }}
    >
      <div className="flex items-center gap-2 p-2 hover:bg-gray-100">
        {icon}
        <div className="flex flex-col">
          <span className="font-semibold">{label}</span>
          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function Menu() {
  return (
    <Paper>
      <div className="flex flex-col w-full min-w-2xl">
        <MenuItem
          icon={<PencilSquareIcon className="size-9" />}
          label="レイドリレーを運営する"
          description="レイドリレーの作成、編集をします"
          href="/events"
        />
        <MenuItem
          icon={<FlagIcon className="size-9" />}
          label="レイドリレーに参加する"
          description="登録済みのレイドリレーに参加します"
          href="/participate"
        />
        <MenuItem
          icon={<QuestionMarkCircleIcon className="size-9" />}
          label="使い方"
          description="レイドリレーの運営方法と参加方法を説明します"
          href="/guide"
        />
      </div>
    </Paper>
  );
}
