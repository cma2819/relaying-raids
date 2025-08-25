import { Form, useSubmit } from "react-router";
import { SubmissionCsvInput } from "./submission-csv-input";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useState } from "react";
import type { Dry } from "~/common/models";
import type { Event } from "./event";
import type { Submission } from "./submission";
import { SubmissionAddInput } from "./submission-add-input";

type HighLightProps = {
  submission: Submission;
  onDelete: () => void;
}

function SubmissionHighlight({ submission, onDelete }: HighLightProps) {

  return (
    <Group>
      <TextInput variant="filled" radius="md" size="sm" id="event-participant" name="event-participant" placeholder="参加者の名前" value={submission.name} readOnly />
      <TextInput variant="filled" radius="md" size="sm" id="event-twitch" name="event-twitch" placeholder="Twitchユーザー名" value={submission.twitch} readOnly />
      <Button size="sm" radius="md" variant="outline" onClick={onDelete}>
        削除
      </Button>
    </Group>
  );
}

type Props = {
  errors?: { name?: string, submissions?: string[]}
}

export function EventForm({ errors }: Props) {
  const [ showDialog, { open, close} ] = useDisclosure(false);
  const [ event, setEvent ] = useState<Dry<Event>>({
    name: "",
    submissions: []
  });
  const submit = useSubmit();

  const handleImportParticipant = () => {
    open();
  };

  const isConfirmable = event.name.trim().length > 2 && event.submissions.length > 0;

  const handleConfirm = (submissions: Dry<Submission>[]) => {
    setEvent({ ...event, submissions });
    close();
  };

  const handleAddSubmission = (submission: Dry<Submission>) => {
    setEvent({ ...event, submissions: [...event.submissions, submission] });
  };

  const handleDeleteSubmission = (submission: Dry<Submission>) => {
    setEvent({ ...event, submissions: event.submissions.filter(s => s !== submission) });
  };

  const submitCallback = useCallback(() => {
    if (!isConfirmable) {
      return;
    }
    const formData = new FormData();
    formData.append("event-name", event.name);
    formData.append("submissions", JSON.stringify(event.submissions));
    submit(formData, { method: "post" });
  }, [event, submit]);

  return (
    <Form method="post">
      <Stack className="w-xl">
        <div>
          <Text component="label" htmlFor="event-name">イベント名</Text>
          <TextInput radius="md" size="md" id="event-name" name="event-name" required value={event.name} onChange={(e) => setEvent({ ...event, name: e.currentTarget.value })} error={errors?.name} />
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
              event.submissions.length > 0 ? (
                <Group className="w-fit" gap="xs">
                  {
                    event.submissions.map((submission, index) => (
                      <SubmissionHighlight key={`${index}-${submission.twitch}`} submission={submission} onDelete={() => handleDeleteSubmission(submission)} />
                    ))
                  }
                </Group>
              ) : (
                <Text c="dimmed">参加者が設定されていません。参加者を追加してください。</Text>
              )
            }
            <SubmissionAddInput onAdd={handleAddSubmission} />
            <Button radius="md" variant="outline" onClick={handleImportParticipant}>CSVから参加者を追加</Button>
          </Stack>
        </div>
        <Button type="button" radius="md" fullWidth variant="filled" disabled={!isConfirmable} onClick={submitCallback}>リレーを作成する</Button>
      </Stack>
      <Modal opened={showDialog} onClose={close} title="CSVから参加者を追加" size="lg">
        <SubmissionCsvInput onConfirm={handleConfirm} />
      </Modal>
    </Form>
  );
}