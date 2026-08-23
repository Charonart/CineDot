import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';

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

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cinedot_be.test/api/v1';
    const origin = baseUrl
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/v1\/?$/, '')
      .replace(/\/api\/?$/, '');

    const candidateEndpoints: string[] = [
      process.env.NEXT_PUBLIC_BROADCAST_AUTH_URL,
      `${origin}/broadcasting/auth`,
      `${origin}/api/broadcasting/auth`,
      `${origin}/api/v1/broadcasting/auth`,
    ].filter(Boolean) as string[];

    let workingAuthEndpoint = candidateEndpoints[0];

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: appKey,
      cluster: cluster,
      wsHost: wsHost || undefined,
      wsPort: wsPort || (isTls ? 443 : 80),
      wssPort: wsPort || 443,
      forceTLS: isTls,
      enabledTransports: ['ws', 'wss'],
      enableStats: false,
      authEndpoint: workingAuthEndpoint,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorizer: (channel: any) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          authorize: (socketId: string, callback: (error: any, data: any) => void) => {
            const token =
              Cookies.get('cine_token') ||
              Cookies.get('cinedot_token') ||
              (typeof window !== 'undefined'
                ? localStorage.getItem('cinedot_token') || localStorage.getItem('cine_token')
                : null) ||
              useAuthStore.getState().token;

            const headers: Record<string, string> = {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            };

            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }

            const bodyPayload = JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            });

            const tryAuth = async (index: number): Promise<unknown> => {
              if (index >= candidateEndpoints.length) {
                throw new Error('All broadcasting auth endpoints returned 404/error.');
              }
              const endpoint = candidateEndpoints[index];
              try {
                const res = await fetch(endpoint, {
                  method: 'POST',
                  headers,
                  credentials: 'include',
                  body: bodyPayload,
                });
                if (!res.ok) {
                  return tryAuth(index + 1);
                }
                workingAuthEndpoint = endpoint;
                return await res.json();
              } catch {
                return tryAuth(index + 1);
              }
            };

            tryAuth(0)
              .then((data) => callback(null, data))
              .catch((err: Error) => {
                console.warn('⚠️ [Pusher Echo Authorizer Offline / Auth Endpoint Unreachable]:', err.message);
                callback(err, null);
              });
          },
        };
      },
    });

    window.Echo = echoInstance;
  }

  return echoInstance;
};
