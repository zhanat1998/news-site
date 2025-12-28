'use client';

import { useEffect, useState } from 'react';
import { Card, Stack, Text, Heading, Badge, Spinner, Button, Flex, Box } from '@sanity/ui';

interface Subscriber {
  id: string;
  createdAt: string;
  lastActive: string;
  deviceType: string;
  deviceModel: string;
  deviceOs: string;
  timezone: string;
  country: string;
  subscribed: boolean;
  sessionCount: number;
}

interface SubscribersData {
  subscribers: Subscriber[];
  total: number;
  limit: number;
  offset: number;
}

export default function SubscribersTool() {
  const [data, setData] = useState<SubscribersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchSubscribers = async (offset: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/subscribers?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(page * limit);
  }, [page]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ky-KG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    const icons: Record<string, string> = {
      'Chrome Web': '🌐',
      'Firefox': '🦊',
      'Safari': '🧭',
      'Edge': '🔷',
      'Android': '🤖',
      'iOS': '🍎',
      'macOS': '💻',
      'Windows': '🪟',
    };
    return icons[deviceType] || '📱';
  };

  if (loading && !data) {
    return (
      <Card padding={5}>
        <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
          <Spinner muted />
          <Box marginLeft={3}>
            <Text muted>Жүктөлүүдө...</Text>
          </Box>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding={5} tone="critical">
        <Stack space={3}>
          <Text>Ката: {error}</Text>
          <Button text="Кайра аракет" onClick={() => fetchSubscribers(page * limit)} />
        </Stack>
      </Card>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <Card padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Stack space={2}>
            <Heading size={2}>Подписчиктер</Heading>
            <Text muted size={1}>Push уведомлениеге подписка болгондор</Text>
          </Stack>
          <Card padding={3} radius={2} tone="positive">
            <Stack space={1}>
              <Text size={4} weight="bold" align="center">
                {data?.total || 0}
              </Text>
              <Text size={1} muted align="center">жалпы</Text>
            </Stack>
          </Card>
        </Flex>

        {/* Refresh button */}
        <Flex>
          <Button
            text="Жаңыртуу"
            onClick={() => fetchSubscribers(page * limit)}
            disabled={loading}
            icon={loading ? Spinner : undefined}
          />
        </Flex>

        {/* Subscribers list */}
        <Stack space={3}>
          {data?.subscribers.map((subscriber) => (
            <Card key={subscriber.id} padding={3} radius={2} shadow={1}>
              <Flex align="center" gap={3}>
                <Text size={3}>{getDeviceIcon(subscriber.deviceType)}</Text>
                <Stack space={2} flex={1}>
                  <Flex align="center" gap={2}>
                    <Badge tone={subscriber.subscribed ? 'positive' : 'caution'}>
                      {subscriber.subscribed ? 'Активдүү' : 'Өчүк'}
                    </Badge>
                    <Badge>{subscriber.deviceType}</Badge>
                    {subscriber.deviceOs && (
                      <Badge tone="primary">{subscriber.deviceOs}</Badge>
                    )}
                  </Flex>
                  <Flex gap={4}>
                    <Text size={1} muted>
                      Кошулду: {formatDate(subscriber.createdAt)}
                    </Text>
                    <Text size={1} muted>
                      Акыркы активдүүлүк: {formatDate(subscriber.lastActive)}
                    </Text>
                    {subscriber.sessionCount > 0 && (
                      <Text size={1} muted>
                        Сессиялар: {subscriber.sessionCount}
                      </Text>
                    )}
                  </Flex>
                </Stack>
              </Flex>
            </Card>
          ))}
        </Stack>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex align="center" justify="center" gap={2}>
            <Button
              text="← Мурунку"
              disabled={page === 0 || loading}
              onClick={() => setPage(p => p - 1)}
            />
            <Text size={1} muted>
              {page + 1} / {totalPages}
            </Text>
            <Button
              text="Кийинки →"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => setPage(p => p + 1)}
            />
          </Flex>
        )}

        {/* Empty state */}
        {data?.subscribers.length === 0 && (
          <Card padding={5} tone="transparent">
            <Text align="center" muted>
              Азырынча подписчик жок
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}