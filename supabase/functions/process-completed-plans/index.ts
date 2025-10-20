// Supabase Edge Function: process-completed-plans
// Schedules: run every 5 minutes (see deployment notes)
// Purpose: Find expired active trading plans and complete them atomically via RPC

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

type TradingPlan = {
  id: string;
  user_id: string;
  investment_amount: number;
  asset_symbol: string;
  status: 'active' | 'completed';
  created_at: string;
  duration_hours: number;
  yield_range_min: number;
  yield_range_max: number;
};

serve(async () => {
  try {
    // 1) Fetch active plans (cap to a reasonable batch)
    const { data: plans, error: fetchErr } = await supabase
      .from('trading_plans')
      .select('*')
      .eq('status', 'active')
      .limit(1000) as unknown as { data: TradingPlan[] | null; error: any };

    if (fetchErr) throw fetchErr;

    const now = new Date();
    const expired = (plans || []).filter((p) => {
      const created = new Date(p.created_at);
      const expiry = new Date(created.getTime() + p.duration_hours * 60 * 60 * 1000);
      return now >= expiry;
    });

    if (expired.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'No expired plans' }), { status: 200 });
    }

    // 2) Complete each plan via RPC to guarantee transaction semantics
    const results = await Promise.all(
      expired.map(async (plan) => {
        const { error } = await supabase.rpc('complete_trading_plan', { p_plan_id: plan.id });
        if (error) {
          return { id: plan.id, ok: false, error: error.message };
        }
        return { id: plan.id, ok: true };
      })
    );

    const succeeded = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);

    return new Response(
      JSON.stringify({ processed: results.length, succeeded, failed }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 500 });
  }
});



