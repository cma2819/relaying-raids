import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Badge, Card, Stack, Text, Title, Timeline } from '@mantine/core';
import { useState } from 'react';
import { ContentContainer } from '~/concerns/common/content-container';
import { Paper } from '~/concerns/common/paper';
import { SubmissionAddInput } from '~/concerns/events/submission-add-input';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('使い方', 'レイドリレーの運営方法と参加方法を説明します');
}

type ViewMode = 'organizer' | 'participant';

export default function Guide() {
  const [viewMode, setViewMode] = useState<ViewMode>('organizer');

  return (
    <ContentContainer title="使い方">
      <Stack gap="xl" className="max-w-4xl">
        <section>
          <Paper>
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <QuestionMarkCircleIcon className="size-6 text-blue-500" />
                <Title order={2} size="h3">レイドリレーとは</Title>
              </div>
              <Text>
                複数の配信者がTwitchの「レイド」機能を使ってリレー形式で配信をつなぐイベントです。
                このアプリでは、レイドリレーの管理と参加をスムーズに行うことができます。
              </Text>
            </Stack>
          </Paper>
        </section>

        <nav className="flex gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setViewMode('organizer')}
            className={`px-4 py-2 font-semibold rounded-t-md transition-colors ${
              viewMode === 'organizer'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            運営する
          </button>
          <button
            type="button"
            onClick={() => setViewMode('participant')}
            className={`px-4 py-2 font-semibold rounded-t-md transition-colors ${
              viewMode === 'participant'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            参加する
          </button>
        </nav>

        {viewMode === 'organizer' && (
          <section>
            <Stack gap="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <div>
                    <Text fw={600} size="lg" mb="sm">1. レイドリレーを作成する</Text>
                    <Text size="sm" c="dimmed" mb="md">
                      ホーム画面から「レイドリレーを運営する」を選択し、「新しいリレーを作成」ボタンをクリックします。
                    </Text>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">2. イベント情報を入力する</Text>
                    <Stack gap="xs">
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <Text size="sm" fw={500} mb="xs">イベント名</Text>
                        <Text size="sm" c="dimmed">例: 春の配信リレー2026</Text>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <Text size="sm" fw={500} mb="xs">slug (URLに使われる識別子)</Text>
                        <Text size="sm" c="dimmed">例: spring-relay-2026</Text>
                        <Text size="xs" c="dimmed" mt="xs">3文字以上の英数字とハイフンが使用できます</Text>
                      </div>
                    </Stack>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">3. 参加者を追加する</Text>
                    <Text size="sm" c="dimmed" mb="md">
                      参加者の名前とTwitchユーザー名を入力して追加します。
                      順番はドラッグ&ドロップで変更できます。
                    </Text>
                    <div className="bg-white p-4 rounded-md border">
                      <SubmissionAddInput onAdd={() => {}} disabled />
                      <Text size="xs" c="dimmed" mt="xs">CSVファイルから一括で参加者を追加することもできます</Text>
                    </div>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">4. リレーを開始する</Text>
                    <Text size="sm" c="dimmed">
                      作成したリレーの詳細画面から「リレーを開始」ボタンをクリックします。
                      開始後は参加者の配信ページへのリンクや進行状況が表示されます。
                    </Text>
                  </div>
                </Stack>
              </Card>

              <Paper>
                <Stack gap="sm">
                  <Text fw={600} size="md">運営者ができること</Text>
                  <Timeline bulletSize={20} lineWidth={2}>
                    <Timeline.Item title="リレーの作成・編集">
                      <Text size="sm" c="dimmed">イベント情報や参加者リストを管理</Text>
                    </Timeline.Item>
                    <Timeline.Item title="リレーの開始・完了">
                      <Text size="sm" c="dimmed">リレーの状態を制御</Text>
                    </Timeline.Item>
                    <Timeline.Item title="進行状況の確認">
                      <Text size="sm" c="dimmed">現在配信中の参加者をリアルタイムで把握</Text>
                    </Timeline.Item>
                    <Timeline.Item title="参加者へのリンク共有">
                      <Text size="sm" c="dimmed">専用URLで参加者ページにアクセス</Text>
                    </Timeline.Item>
                  </Timeline>
                </Stack>
              </Paper>
            </Stack>
          </section>
        )}

        {viewMode === 'participant' && (
          <section>
            <Stack gap="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <div>
                    <Text fw={600} size="lg" mb="sm">1. 参加リレーを確認する</Text>
                    <Text size="sm" c="dimmed" mb="md">
                      ホーム画面から「レイドリレーに参加する」を選択すると、
                      自分が参加者として登録されているリレーの一覧が表示されます。
                    </Text>
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <Card shadow="sm" padding="md" radius="md" withBorder className="bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Text fw={600} size="lg">春の配信リレー2026</Text>
                              <Badge color="green" variant="filled">進行中</Badge>
                            </div>
                            <Text size="sm" c="dimmed">slug: spring-relay-2026</Text>
                          </div>
                        </div>
                      </Card>
                      <Text size="xs" c="dimmed" mt="xs">リレーの状態はバッジで表示されます</Text>
                    </div>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">2. リレーの詳細を確認する</Text>
                    <Text size="sm" c="dimmed">
                      リレーをクリックすると、参加者リストと自分の順番を確認できます。
                      リレーが開始されると、現在配信中の参加者と次の配信者が表示されます。
                    </Text>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">3. 自分の番になったら配信する</Text>
                    <Text size="sm" c="dimmed" mb="xs">
                      自分の順番が来たら、Twitchで配信を開始してください。
                    </Text>
                    <Text size="sm" c="dimmed">
                      配信終了時は、次の参加者に向けてレイドを送ります。
                    </Text>
                  </div>
                </Stack>
              </Card>

              <Paper>
                <Stack gap="sm">
                  <Text fw={600} size="md">参加者が確認できる情報</Text>
                  <Timeline bulletSize={20} lineWidth={2}>
                    <Timeline.Item title="参加リレーの一覧">
                      <Text size="sm" c="dimmed">自分が登録されているリレーをすべて表示</Text>
                    </Timeline.Item>
                    <Timeline.Item title="リレーの状態">
                      <Text size="sm" c="dimmed">待機中・進行中・完了済みのステータス</Text>
                    </Timeline.Item>
                    <Timeline.Item title="参加者リストと順番">
                      <Text size="sm" c="dimmed">自分の配信順番を確認</Text>
                    </Timeline.Item>
                    <Timeline.Item title="現在の配信者">
                      <Text size="sm" c="dimmed">誰が配信中か、次は誰かをリアルタイムで把握</Text>
                    </Timeline.Item>
                    <Timeline.Item title="配信ページへのリンク">
                      <Text size="sm" c="dimmed">参加者のTwitch配信ページに直接アクセス</Text>
                    </Timeline.Item>
                  </Timeline>
                </Stack>
              </Paper>
            </Stack>
          </section>
        )}

      </Stack>
    </ContentContainer>
  );
}
