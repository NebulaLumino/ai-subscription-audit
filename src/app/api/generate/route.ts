import { NextRequest, NextResponse } from 'next/server';

let _clientPromise: Promise<any> | null = null;

async function getClient() {
  if (!_clientPromise) {
    _clientPromise = (async () => {
      const { default: OpenAI } = await import('openai');
      return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
      });
    })();
  }
  return _clientPromise;
}

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json();
    const subscriptions = inputs?.subscriptions || '';
    const monthlyBudget = inputs?.monthlyBudget || '';
    const goals = inputs?.goals || '';

    const prompt = `You are a personal finance advisor specializing in subscription auditing and cost reduction. Analyze subscriptions and find savings:

Current Subscriptions: ${subscriptions}
Monthly Entertainment/Subscription Budget: $${monthlyBudget || 'Not set'}
Savings Goals: ${goals || 'Reduce monthly costs'}

Provide:
1. Complete audit of all subscriptions (necessary vs nice-to-have)
2. Total monthly/yearly subscription cost analysis
3. Specific cancellation or downgrade recommendations
4. Free or cheaper alternatives for each paid subscription
5. Subscription bundling opportunities to save money
6. Negotiation strategies for reducing bills
7. A prioritized action plan ranked by savings impact
8. Estimated annual savings from implemented changes

Be specific with prices and alternatives. Format clearly.`;

    const client = await getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
