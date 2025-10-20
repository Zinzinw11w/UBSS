-- Postgres function to complete a trading plan atomically
-- Creates function and grants execute to anon for rpc invocation via Edge Function (uses service role)

create or replace function public.complete_trading_plan(p_plan_id uuid)
returns void
language plpgsql
as $$
declare
  v_plan record;
  v_random_yield numeric;
  v_profit numeric;
  v_total_return numeric;
begin
  -- Lock plan row
  select * into v_plan from public.trading_plans where id = p_plan_id for update;
  if not found then
    raise exception 'plan not found';
  end if;
  if v_plan.status <> 'active' then
    return; -- already processed
  end if;

  -- Compute random yield within range
  v_random_yield := (random() * (v_plan.yield_range_max - v_plan.yield_range_min)) + v_plan.yield_range_min;
  v_profit := v_plan.investment_amount * (v_random_yield / 100.0);
  v_total_return := v_plan.investment_amount + v_profit;

  -- Update plan
  update public.trading_plans
     set status = 'completed',
         profit_amount = v_profit,
         total_return = v_total_return,
         final_yield = v_random_yield,
         completed_at = now()
   where id = p_plan_id;

  -- Credit user balance
  update public.users
     set balance = coalesce(balance,0) + v_total_return,
         total_profit = coalesce(total_profit,0) + v_profit
   where id = v_plan.user_id;
end;
$$;

-- Allow RPC call (Edge function uses service role; leaving grant for completeness)
grant execute on function public.complete_trading_plan(uuid) to anon, authenticated, service_role;



