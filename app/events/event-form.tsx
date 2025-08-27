import { Form, useSubmit, useNavigation } from 'react-router';
import { SubmissionCsvInput } from './submission-csv-input';
import { Button, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useState } from 'react';
import type { Dry } from '~/common/models';
import type { Event } from './event';
import type { Submission } from './submission';
import { SubmissionAddInput } from './submission-add-input';
import { DraggableSubmissionList } from './draggable-submission-list';

type Props = {
  errors?: { name?: string; slug?: string; submissions?: string[] };
  initialEvent?: { name: string; slug: string; submissions: Array<{ name: string; twitch: string; order: number }> };
  baseUrl?: string;
};

export function EventForm({ errors, initialEvent, baseUrl }: Props) {
  const [showDialog, { open, close }] = useDisclosure(false);
  const [event, setEvent] = useState<Dry<Event>>(initialEvent || {
    name: '',
    slug: '',
    submissions: [],
  });
  const submit = useSubmit();
  const navigation = useNavigation();

  const handleImportParticipant = () => {
    open();
  };

  const isConfirmable = event.name.trim().length > 2 && event.slug.trim().length >= 3 && event.submissions.length > 0;
  const isSubmitting = navigation.state === 'submitting';

  const handleConfirm = (submissions: Dry<Submission>[]) => {
    setEvent({ ...event, submissions });
    close();
  };

  const handleAddSubmission = (submission: Dry<Submission>) => {
    const newOrder = event.submissions.length + 1;
    const submissionWithOrder = { ...submission, order: newOrder };
    setEvent({ ...event, submissions: [...event.submissions, submissionWithOrder] });
  };

  const handleDeleteSubmission = (submission: Dry<Submission>) => {
    const filteredSubmissions = event.submissions.filter(s => s !== submission);
    const reorderedSubmissions = filteredSubmissions.map((s, index) => ({
      ...s,
      order: index + 1,
    }));
    setEvent({ ...event, submissions: reorderedSubmissions });
  };

  const handleReorderSubmissions = (reorderedSubmissions: Dry<Submission>[]) => {
    setEvent({ ...event, submissions: reorderedSubmissions });
  };

  const submitCallback = useCallback(() => {
    if (!isConfirmable) {
      return;
    }
    const formData = new FormData();
    formData.append('event-name', event.name);
    formData.append('event-slug', event.slug);
    formData.append('submissions', JSON.stringify(event.submissions));
    submit(formData, { method: 'post' });
  }, [event, submit]);

  return (
    <Form method="post">
      <Stack className="w-xl">
        <div>
          <Text component="label" htmlFor="event-name">イベント名</Text>
          <TextInput
            radius="md"
            size="md"
            id="event-name"
            name="event-name"
            required
            value={event.name}
            onChange={e => setEvent({ ...event, name: e.currentTarget.value })}
            error={errors?.name}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Text component="label" htmlFor="event-slug">slug (URLに使われる識別子、3文字以上の英数字とハイフン)</Text>
          <TextInput
            radius="md"
            size="md"
            id="event-slug"
            name="event-slug"
            required
            value={event.slug}
            onChange={e => setEvent({ ...event, slug: e.currentTarget.value })}
            error={errors?.slug}
            leftSection={baseUrl && (
              <Text size="sm" c="dimmed">
                {baseUrl}
                /events/
              </Text>
            )}
            leftSectionWidth={200}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Text component="label" htmlFor="event-name">参加者</Text>
          {
            errors?.submissions && (
              errors.submissions.map((error, index) => (
                <Text key={index} c="red" size="sm">{error}</Text>
              ))
            )
          }
          <Stack>
            {
              event.submissions.length > 0
                ? (
                    <DraggableSubmissionList
                      submissions={event.submissions}
                      onReorder={handleReorderSubmissions}
                      onDelete={handleDeleteSubmission}
                    />
                  )
                : (
                    <Text c="dimmed">参加者が設定されていません。参加者を追加してください。</Text>
                  )
            }
            <SubmissionAddInput onAdd={handleAddSubmission} disabled={isSubmitting} />
            <Button radius="md" variant="outline" onClick={handleImportParticipant} disabled={isSubmitting}>CSVから参加者を追加</Button>
          </Stack>
        </div>
        <Button
          type="button"
          radius="md"
          fullWidth
          variant="filled"
          disabled={!isConfirmable || isSubmitting}
          loading={isSubmitting}
          onClick={submitCallback}
        >
          {initialEvent ? 'リレーを更新する' : 'リレーを作成する'}
        </Button>
      </Stack>
      <Modal opened={showDialog} onClose={close} title="CSVから参加者を追加" size="lg">
        <SubmissionCsvInput onConfirm={handleConfirm} />
      </Modal>
    </Form>
  );
}
