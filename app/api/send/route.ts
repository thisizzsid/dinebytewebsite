import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, restaurant, email } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'DineByte <onboarding@resend.dev>',
      to: ['siddhant.anand17@gmail.com'], // Send notification to your email
      subject: 'New Demo Request: ' + restaurant,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ea580c;">New Demo Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Restaurant:</strong> ${restaurant}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This request was sent from the DineByte website.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
