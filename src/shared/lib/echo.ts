import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'pusher'> | undefined;
  }
}

let echoInstance: Echo<'pusher'> | null = null;

export const getEcho = (): Echo<'pusher'> | null => {
  if (typeof window === 'undefined') return null;

  if (!echoInstance) {
    window.Pusher = Pusher;
    if (process.env.NODE_ENV !== 'production') {
      Pusher.logToConsole = true;
    }

    const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '2749e24d6fa468eeb986';
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';
    const wsHost = process.env.NEXT_PUBLIC_PUSHER_HOST;
    const wsPort = process.env.NEXT_PUBLIC_PUSHER_PORT ? Number(process.env.NEXT_PUBLIC_PUSHER_PORT) : undefined;
    const scheme = process.env.NEXT_PUBLIC_PUSHER_SCHEME || 'https';
    const isTls = scheme === 'https';

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: appKey,
      cluster: cluster,
      wsHost: wsHost || undefined,
      wsPort: wsPort || (isTls ? 443 : 80),
      wssPort: wsPort || 443,
      forceTLS: isTls,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
    });

    window.Echo = echoInstance;
  }

  return echoInstance;
};
