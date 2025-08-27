import { ActionIcon, Table } from '@mantine/core';
import type { Submission } from './submission';
import { TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  submissions: Submission[];
  onDelete: (index: number) => void;
};

export function SubmissionCsvList({ submissions, onDelete }: Props) {
  return (
    <Table.ScrollContainer minWidth={320} maxHeight={600}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>参加者名</Table.Th>
            <Table.Th>TwitchID</Table.Th>
            <Table.Th>削除</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {submissions.map((submission, index) => (
            <Table.Tr key={`${index}_${submission.twitch}`}>
              <Table.Td>{submission.name}</Table.Td>
              <Table.Td>{submission.twitch}</Table.Td>
              <Table.Td>
                <ActionIcon variant="subtle" onClick={() => onDelete(index)}>
                  <TrashIcon className="size-5" />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
