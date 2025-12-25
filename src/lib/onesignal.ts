// OneSignal Server-Side API Helper Functions

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

interface NotificationPayload {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
}

interface OneSignalResponse {
  id?: string;
  recipients?: number;
  errors?: string[];
}

// Push notification жөнөтүү
export async function sendPushNotification(payload: NotificationPayload): Promise<OneSignalResponse> {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    console.error('OneSignal credentials missing');
    return { errors: ['OneSignal credentials not configured'] };
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users'],
        headings: { en: payload.title, ky: payload.title },
        contents: { en: payload.message, ky: payload.message },
        url: payload.url,
        chrome_web_image: payload.imageUrl,
        firefox_icon: payload.imageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OneSignal API error:', data);
      return { errors: data.errors || ['Failed to send notification'] };
    }

    console.log('Notification sent successfully:', data);
    return {
      id: data.id,
      recipients: data.recipients,
    };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { errors: ['Network error'] };
  }
}

// Subscribers санын алуу
export async function getSubscribersCount(): Promise<number> {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return 0;
  }

  try {
    const response = await fetch(
      `https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`,
      {
        headers: {
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data.players || 0;
  } catch (error) {
    console.error('Error fetching subscribers count:', error);
    return 0;
  }
}

// Subscribers тизмесин алуу (pagination менен)
export async function getSubscribers(limit: number = 50, offset: number = 0) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return { subscribers: [], total: 0 };
  }

  try {
    const response = await fetch(
      `https://onesignal.com/api/v1/players?app_id=${ONESIGNAL_APP_ID}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    return {
      subscribers: data.players || [],
      total: data.total_count || 0,
    };
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return { subscribers: [], total: 0 };
  }
}
