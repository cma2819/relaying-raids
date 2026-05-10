import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { Link } from 'react-router';

type Event = {
  id: number;
  name: string;
  slug: string;
  moderator: string;
  isCompleted: boolean;
};

type Props = {
  events: Event[];
};

export function EventList({ events }: Props) {
  if (events.length === 0) {
    return (
      <Stack align="center" gap="md">
        <Text c="dimmed">まだリレーを作成していません。</Text>
        <Button component={Link} to="/events/-/new" radius="md">
          新しいリレーを作成
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {events.map(event => (
        <Card key={event.id} shadow="sm" padding="md" radius="md" withBorder className={event.isCompleted ? 'opacity-60' : ''}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="xs" align="center">
                <Text fw={600} size="lg" c={event.isCompleted ? 'gray' : undefined}>{event.name}</Text>
                {event.isCompleted && (
                  <Badge color="gray" variant="filled">
                    完了済み
                  </Badge>
                )}
              </Group>
              <Text size="sm" c="dimmed">
                slug:
                {event.slug}
              </Text>
            </div>
            <Group gap="xs">
              <Button
                component={Link}
                to={`/events/${event.slug}/progress`}
                size="sm"
                radius="md"
                variant="filled"
                color="green"
                disabled={event.isCompleted}
              >
                進行管理
              </Button>
              <Button
                component={Link}
                to={`/events/${event.slug}`}
                size="sm"
                radius="md"
                variant="outline"
                disabled={event.isCompleted}
              >
                編集
              </Button>
            </Group>
          </Group>
        </Card>
      ))}
      <Button component={Link} to="/events/-/new" radius="md" variant="outline">
        新しいリレーを作成
      </Button>
    </Stack>
  );
}
