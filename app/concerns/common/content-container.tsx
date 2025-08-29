import type { ReactNode } from 'react';
import { Paper } from './paper';
import { Head } from './head';

type Props = {
  title: string;
  children: ReactNode;
};

export function ContentContainer({ title, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Paper>
        <div className="mb-4 min-w-lg">
          <Head level="h2">{title}</Head>
        </div>
        {children}
      </Paper>
    </div>
  );
}
