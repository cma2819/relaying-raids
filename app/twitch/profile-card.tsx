import { Avatar, Button, Group } from '@mantine/core';
import { Form } from 'react-router';
import { Paper } from '~/common/paper';

type Props = {
  avatar: string;
  login: string;
  displayName: string;
};

export function ProfileCard({ avatar, login, displayName }: Props) {
  return (
    <Paper className="w-sm">
      <Form action="/logout" method="GET">
        <Group>
          <Avatar variant="outline" src={avatar} radius="xl" size="lg" />
          <div className="flex flex-col">
            <span className="font-semibold">{displayName}</span>
            <span className="text-sm text-gray-500">
              @
              {login}
            </span>
          </div>
          <Button className="ml-auto" variant="subtle" type="submit">Logout</Button>
        </Group>
      </Form>
    </Paper>
  );
}
