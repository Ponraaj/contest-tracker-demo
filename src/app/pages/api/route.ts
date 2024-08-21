import { NextRequest, NextResponse } from 'next/server';

// GraphQL query to fetch user contest ranking information
const leetcodeContestQuery = (username: string) => `
{
  userContestRankingHistory(username: "${username}") {
    attended
    rating
    ranking
    contest {
      title
    }
  }
}
`;

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Fetching data using the contest ranking query
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: leetcodeContestQuery(username) }),
    });

    // Parsing the response
    const data = await response.json();

    // Handling errors in the response
    if (!response.ok || data.errors) {
      return NextResponse.json({ error: 'Failed to fetch data', details: data.errors }, { status: response.status });
    }

    // Returning the contest ranking data
    return NextResponse.json(data.data.userContestRankingHistory);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method GET Not Allowed' }, { status: 405 });
}
