import { CheckCircleIcon, DocumentDuplicateIcon, EllipsisHorizontalIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { ActionIcon, Badge, Button, Card, Group, Stack, Text, Title, Timeline } from '@mantine/core';
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
            <Stack gap="xl">
              <Stack gap="md">
                <Title order={3} size="h4">リレーの準備</Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="lg">
                    <div>
                      <Text fw={600} size="lg" mb="sm">1. レイドリレーを作成する</Text>
                      <Text size="sm" c="gray.7" mb="md">
                        ホーム画面から「レイドリレーを運営する」を選択し、「新しいリレーを作成」ボタンをクリックします。
                      </Text>
                    </div>

                    <div>
                      <Text fw={600} size="lg" mb="sm">2. イベント情報を入力する</Text>
                      <Stack gap="xs">
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <Text size="sm" fw={500} mb="xs">イベント名</Text>
                          <Text size="sm" c="gray.7">例: 春の配信リレー2026</Text>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <Text size="sm" fw={500} mb="xs">slug (URLに使われる識別子)</Text>
                          <Text size="sm" c="gray.7">例: spring-relay-2026</Text>
                          <Text size="xs" c="gray.7" mt="xs">3文字以上の英数字とハイフンが使用できます</Text>
                        </div>
                      </Stack>
                    </div>

                    <div>
                      <Text fw={600} size="lg" mb="sm">3. 参加者を追加する</Text>
                      <Text size="sm" c="gray.7" mb="md">
                        参加者の名前とTwitchユーザー名を入力して追加します。
                        順番はドラッグ&ドロップで変更できます。
                      </Text>
                      <div className="bg-white p-4 rounded-md border">
                        <SubmissionAddInput onAdd={() => {}} disabled />
                        <Text size="xs" c="gray.7" mt="xs">CSVファイルから一括で参加者を追加することもできます</Text>
                      </div>
                    </div>

                    <div>
                      <Text fw={600} size="lg" mb="sm">4. リレーを開始する</Text>
                      <Text size="sm" c="gray.7">
                        作成後はいつでもリレーを始められる状態です。
                        最初の参加者からレイドリレーを始めましょう！
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </Stack>

              <Stack gap="md">
                <Title order={3} size="h4">リダイレクトURLを公開</Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="lg">
                    <Text size="sm" c="gray.7">
                      リダイレクトURLは、アクセスした時点で配信中の参加者のTwitchページへ自動的に転送する専用URLです。
                      視聴者はこのURLをブックマークしておくだけで、常に現在の配信者へたどり着けます。
                    </Text>
                    <Text size="sm" c="gray.7">
                      SNS等での告知に活用して、視聴者が常に最新の配信を見つけられるようにしましょう。
                    </Text>

                    <div>
                      <Text fw={600} size="lg" mb="sm">URLの取得方法</Text>
                      <Text size="sm" c="gray.7" mb="sm">
                        リレーの進行管理ページ上部にあるボタンを押すと、クリップボードにURLがコピーされます。
                      </Text>
                      <Button
                        variant="light"
                        color="violet"
                        size="sm"
                        leftSection={<DocumentDuplicateIcon className="w-4 h-4" />}
                      >
                        リダイレクトURLをコピー
                      </Button>
                    </div>

                  </Stack>
                </Card>
              </Stack>

              <Stack gap="md">
                <Title order={3} size="h4">進行状況を確認・修正</Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="lg">
                    <Text size="sm" c="gray.7">
                      リレーの進行管理ページでは、現在の配信者をリアルタイムで確認しながら進行を手動で修正できます。
                    </Text>

                    <div>
                      <Text fw={600} size="lg" mb="sm">現在の配信者を確認する</Text>
                      <Text size="sm" c="gray.7" mb="sm">
                        ページ上部のカードに現在配信中の参加者が表示されます。レイドを送った後は「レイド済み」バッジが付きます。
                      </Text>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                        <Group gap="xs">
                          <Badge variant="filled" color="blue">現在</Badge>
                          <Text fw={500} size="sm">山田太郎</Text>
                          <Text size="sm" c="gray.7">(@yamada_taro)</Text>
                          <Text size="sm" c="gray.7">#3</Text>
                          <Badge variant="light" color="green">レイド済み</Badge>
                        </Group>
                      </div>
                    </div>

                    <div>
                      <Text fw={600} size="lg" mb="sm">進行を修正する</Text>
                      <Text size="sm" c="gray.7" mb="sm">
                        参加者リストの各行右端にある
                        {' '}
                        <ActionIcon variant="light" color="gray" size="sm" component="span">
                          <EllipsisHorizontalIcon className="w-4 h-4" />
                        </ActionIcon>
                        {' '}
                        メニューから進行位置を修正できます。
                      </Text>
                      <Stack gap="xs">
                        <div className="bg-gray-50 p-3 rounded-md border">
                          <Text size="sm" fw={500} c="blue" mb="xs">ここに戻す</Text>
                          <Text size="sm" c="gray.7">現在より前の参加者に進行を戻します。順番を間違えたときや、やり直しが必要なときに使います。</Text>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md border">
                          <Text size="sm" fw={500} c="orange" mb="xs">ここまでスキップ</Text>
                          <Text size="sm" c="gray.7">現在より後の参加者に進行を進めます。欠席者が出たときなどに使います。</Text>
                        </div>
                      </Stack>
                    </div>

                    <div>
                      <Text fw={600} size="lg" mb="sm">リレーを完了する</Text>
                      <Text size="sm" c="gray.7" mb="sm">
                        全員の配信が終わったら、下のボタンでリレーを完了済みにします。完了後は編集や進行修正ができなくなります。
                      </Text>
                      <Button
                        leftSection={<CheckCircleIcon className="w-5 h-5" />}
                        color="green"
                        variant="light"
                      >
                        レイドリレーを完了する
                      </Button>
                    </div>
                  </Stack>
                </Card>
              </Stack>
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
                    <Text size="sm" c="gray.7" mb="md">
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
                            <Text size="sm" c="gray.7">slug: spring-relay-2026</Text>
                          </div>
                        </div>
                      </Card>
                      <Text size="xs" c="gray.7" mt="xs">リレーの状態はバッジで表示されます</Text>
                    </div>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">2. リレーの詳細を確認する</Text>
                    <Text size="sm" c="gray.7">
                      リレーをクリックすると、参加者リストと自分の順番を確認できます。
                      リレーが開始されると、現在配信中の参加者と次の配信者が表示されます。
                    </Text>
                  </div>

                  <div>
                    <Text fw={600} size="lg" mb="sm">3. 自分の番になったら配信する</Text>
                    <Text size="sm" c="gray.7" mb="xs">
                      自分の順番が来たら、Twitchで配信を開始してください。
                    </Text>
                    <Text size="sm" c="gray.7">
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
                      <Text size="sm" c="gray.7">自分が登録されているリレーをすべて表示</Text>
                    </Timeline.Item>
                    <Timeline.Item title="リレーの状態">
                      <Text size="sm" c="gray.7">待機中・進行中・完了済みのステータス</Text>
                    </Timeline.Item>
                    <Timeline.Item title="参加者リストと順番">
                      <Text size="sm" c="gray.7">自分の配信順番を確認</Text>
                    </Timeline.Item>
                    <Timeline.Item title="現在の配信者">
                      <Text size="sm" c="gray.7">誰が配信中か、次は誰かをリアルタイムで把握</Text>
                    </Timeline.Item>
                    <Timeline.Item title="配信ページへのリンク">
                      <Text size="sm" c="gray.7">参加者のTwitch配信ページに直接アクセス</Text>
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
