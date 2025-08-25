import { Button, Group, TextInput } from "@mantine/core";
import { useState } from "react";
import type { Dry } from "~/common/models";
import type { Submission } from "./submission";

type Props = {
    onAdd: (submission: Dry<Submission>) => void;
}

export function SubmissionAddInput({ onAdd }: Props) {
  const [ newSubmission, setNewSubmission ] = useState<Dry<Submission>>({
    name: "",
    twitch: ""
  });

  const disableAddButton = newSubmission.name.trim().length === 0 || newSubmission.twitch.trim().length === 0;

  const handleAdd = () => {
    onAdd(newSubmission);
    setNewSubmission({ name: "", twitch: "" });
  };

  return (
    <Group>
      <TextInput radius="md" size="md" id="event-participant" name="event-participant" placeholder="参加者の名前" value={newSubmission.name} onChange={(e) => setNewSubmission({ ...newSubmission, name: e.currentTarget.value })} />
      <TextInput radius="md" size="md" id="event-twitch" name="event-twitch" placeholder="Twitchユーザー名" value={newSubmission.twitch} onChange={(e) => setNewSubmission({ ...newSubmission, twitch: e.currentTarget.value })} />
      <Button radius="md" variant="outline" disabled={disableAddButton} onClick={handleAdd}>追加</Button>
    </Group>
  );
}