import { getScores } from '../lib/db';
import AdminScoreClient from '../components/AdminScoreClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const initialScores = await getScores();
  return <AdminScoreClient initialScores={initialScores} />;
}
