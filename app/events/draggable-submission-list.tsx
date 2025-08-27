import { Button, Group, TextInput } from '@mantine/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Dry } from '~/common/models';
import type { Submission } from './submission';

type SortableItemProps = {
  submission: Submission;
  onDelete: () => void;
};

function SortableSubmissionItem({ submission, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: submission.order });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Group>
        <div
          {...listeners}
          style={{
            cursor: 'grab',
            padding: '8px',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            minWidth: '20px',
            textAlign: 'center',
            fontSize: '12px',
            backgroundColor: '#f9f9f9',
          }}
        >
          ⋮⋮
        </div>
        <TextInput variant="filled" radius="md" size="sm" placeholder="参加者の名前" value={submission.name} readOnly />
        <TextInput variant="filled" radius="md" size="sm" placeholder="Twitchユーザー名" value={submission.twitch} readOnly />
        <Button size="sm" radius="md" variant="outline" onClick={onDelete}>
          削除
        </Button>
      </Group>
    </div>
  );
}

type Props = {
  submissions: Dry<Submission>[];
  onReorder: (submissions: Dry<Submission>[]) => void;
  onDelete: (submission: Dry<Submission>) => void;
};

export function DraggableSubmissionList({ submissions, onReorder, onDelete }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: { active: { id: number | string }; over: { id: number | string } | null }) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = submissions.findIndex(item => item.order === Number(active.id));
      const newIndex = submissions.findIndex(item => item.order === Number(over?.id));

      const reorderedSubmissions = arrayMove(submissions, oldIndex, newIndex);

      const updatedSubmissions = reorderedSubmissions.map((submission, index) => ({
        ...submission,
        order: index + 1,
      }));

      onReorder(updatedSubmissions);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={submissions.map(s => s.order)} strategy={verticalListSortingStrategy}>
        {submissions.map(submission => (
          <SortableSubmissionItem
            key={submission.order}
            submission={submission}
            onDelete={() => onDelete(submission)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
