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

export function ParticipatingEventList({ events }: Props) {
  if (events.length === 0) {
    return (
      <Stack align="center" gap="md">
        <Text c="dimmed">まだリレーに参加していません。</Text>
        <Text size="sm" c="dimmed">
          リレー作成者に登録してもらうとここに表示されます。
        </Text>
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
            <Button
              component={Link}
              to={`/participate/${event.slug}`}
              size="sm"
              radius="md"
              variant="outline"
            >
              詳細を見る
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
