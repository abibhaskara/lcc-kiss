import { NextResponse } from 'next/server';
import { getScores, updateScore, updateTeamName } from '../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const scores = getScores();
    return NextResponse.json(scores, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (e) {
    return NextResponse.json({
      team1: { name: "TIM A", score: 0 },
      team2: { name: "TIM B", score: 0 },
      team3: { name: "TIM C", score: 0 }
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let scores;
    if (body.name !== undefined) {
      scores = updateTeamName(body.teamId, body.name);
    } else if (body.increment !== undefined) {
      scores = updateScore(body.teamId, body.increment);
    } else {
      scores = getScores();
    }
    return NextResponse.json(scores, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
