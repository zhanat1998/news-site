import { definePlugin, type Tool } from 'sanity';
import { UsersIcon } from '@sanity/icons';
import { lazy } from 'react';

const SubscribersTool = lazy(() => import('../components/SubscribersTool'));

export const subscribersTool = definePlugin({
  name: 'subscribers-tool',
  tools: [
    {
      name: 'subscribers',
      title: 'Подписчиктер',
      icon: UsersIcon,
      component: SubscribersTool,
    } as Tool,
  ],
});