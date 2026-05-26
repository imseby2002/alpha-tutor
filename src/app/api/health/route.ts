import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      {
        ok: false,
        supabase: "missing_env",
        message: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      const code = error.code ?? "unknown";
      const needsMigration =
        code === "42P01" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache");

      return NextResponse.json(
        {
          ok: false,
          supabase: needsMigration ? "needs_migration" : "query_error",
          code,
          hint: needsMigration
            ? "Run supabase/migrations/20260526000000_init_schema.sql in Supabase SQL Editor"
            : error.message,
        },
        { status: needsMigration ? 503 : 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      supabase: "connected",
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { ok: false, supabase: "error", message },
      { status: 500 }
    );
  }
}
