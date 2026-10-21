import { getScores } from '../../../actions';
import EventEmitter from 'events';

export const dynamic = 'force-dynamic';

if (!globalThis.scoreEmitter) {
  globalThis.scoreEmitter = new EventEmitter();
  globalThis.scoreEmitter.setMaxListeners(50);
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const initialScores = await getScores();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialScores)}\n\n`));
      } catch (e) {}

      const onUpdate = (scores) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(scores)}\n\n`));
        } catch (e) {}
      };

      globalThis.scoreEmitter.on('score-update', onUpdate);

      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (e) {
          clearInterval(pingInterval);
        }
      }, 15000);

      return () => {
        globalThis.scoreEmitter.off('score-update', onUpdate);
        clearInterval(pingInterval);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
