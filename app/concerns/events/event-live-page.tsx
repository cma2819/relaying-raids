import { Stack } from '@mantine/core';
import { ContentContainer } from '~/concerns/common/content-container';
import { CurrentStreamerCard } from './current-streamer-card';
import { LiveParticipantList } from './live-participant-list';
import type { Submission } from './submission';

type EventWithSubmissions = {
  id: number;
  name: string;
  slug: string;
  moderator: string;
  submissions: Submission[];
};

type EventLivePageProps = {
  event: EventWithSubmissions | null | undefined;
  currentSubmission: Submission | null | undefined;
  parentDomain?: string;
};

export function EventLivePage({ event, currentSubmission, parentDomain }: EventLivePageProps) {
  if (!event) {
    return (
      <ContentContainer title="ライブ配信">
        <div>データの読み込みに失敗しました</div>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer title={`${event.name} - ライブ配信`}>
      <Stack gap="md">
        <CurrentStreamerCard
          currentSubmission={currentSubmission || null}
          parentDomain={parentDomain}
        />
        <LiveParticipantList
          submissions={event.submissions}
          currentSubmission={currentSubmission || null}
        />
      </Stack>
    </ContentContainer>
  );
}
