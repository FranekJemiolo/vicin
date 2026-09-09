// Supabase Edge Function: send-push
// Dispatches notifications to the Expo Push API (https://exp.host/--/api/v2/push/send)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default' | null;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { messages }: { messages: PushMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Filter valid Expo push tokens
    const validMessages = messages.filter(
      msg =>
        msg.to && (msg.to.startsWith('ExponentPushToken[') || msg.to.startsWith('ExpoPushToken['))
    );

    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ success: true, count: 0, note: 'No valid Expo tokens' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Expo Push API accepts batches of up to 100 messages
    const chunks: PushMessage[][] = [];
    for (let i = 0; i < validMessages.length; i += 100) {
      chunks.push(validMessages.slice(i, i + 100));
    }

    const ticketResults = [];
    for (const chunk of chunks) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      const data = await response.json();
      ticketResults.push(data);
    }

    return new Response(
      JSON.stringify({ success: true, count: validMessages.length, results: ticketResults }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
