import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log('[ExchangeRecovery] POST invoked', { url: request.url });
    const text = await request.text();
    let body: any = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      console.warn('[ExchangeRecovery] failed to parse JSON body, raw:', text);
    }
    console.log('[ExchangeRecovery] body:', body);
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Missing recovery code" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log('[ExchangeRecovery] exchanging code for session');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log('[ExchangeRecovery] exchange result', { error: error?.message, hasSession: !!data?.session });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to exchange recovery code" },
        { status: 400 }
      );
    }

    // Return session tokens so client can set them directly
    if (data.session) {
      return NextResponse.json({
        success: true,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      });
    }

    return NextResponse.json(
      { error: "No session returned from code exchange" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
