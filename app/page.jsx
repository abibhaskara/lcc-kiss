import { getScores } from './lib/db';
import LiveScoreClient from './components/LiveScoreClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PreviewPage() {
  const initialScores = await getScores();
  return <LiveScoreClient initialScores={initialScores} />;
}
