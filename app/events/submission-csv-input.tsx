"use client";

import { PaperClipIcon } from "@heroicons/react/24/outline";
import { Button, FileButton, Group, Stack, Text } from "@mantine/core";
import { loadSubmissionCsv, type Submission } from "./submission";
import { useState } from "react";
import { SubmissionCsvList } from "./submission-csv-list";

type Props = {
  onConfirm: (submissions: Submission[]) => void;
}

export function SubmissionCsvInput({ onConfirm }: Props) {
  const [status, setStatus] = useState<"waiting" | "loading" | "done">("waiting");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      return;
    }
    setStatus("loading");

    loadSubmissionCsv(file, (submissions) => {
      setSubmissions(submissions);
      setStatus("done");
    });
  };

  const handleDelete = (index: number) => {
    setSubmissions((prev) => prev.filter((_, i) => i !== index));
  };

  const resetInput = () => {
    setSubmissions([]);
    setStatus("waiting");
  };

  return (
    <Stack>
      {
        status === "waiting" && (
          <>
            <Text c="dimmed" size="sm">行形式: [参加者名, TwitchID]（ヘッダ行は不要です）</Text>
            <FileButton onChange={handleFileChange} accept=".csv">
              {(props) => <Button {...props} leftSection={<PaperClipIcon className="size-5" />}>
                ファイルを選択
              </Button>}
            </FileButton>
          </>
        )
      }
      {
        status === "loading" && (
          <Text>Loading...</Text>
        )
      }
      {
        status === "done" && (
          <>
            <SubmissionCsvList submissions={submissions} onDelete={handleDelete} />
            <Group>
              <Button variant="filled" onClick={() => onConfirm(submissions)}>参加者を追加する</Button>
              <Button variant="outline" color="gray" onClick={resetInput}>やり直す</Button>
            </Group>
          </>
        )
      }
    </Stack>
  );
}