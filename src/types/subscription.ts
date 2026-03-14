/** Subscription plan types */
export const PLAN_TYPES = ['free', 'pro', 'pro_annual'] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

/** Subscription status */
export const SUBSCRIPTION_STATUSES = ['active', 'cancelled', 'past_due', 'trialing'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

/** Subscription record (mirrors DB schema) */
export interface Subscription {
  user_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_sub_id: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

/** Whether a plan has Pro access */
export function isPro(plan: PlanType): boolean {
  return plan === 'pro' || plan === 'pro_annual';
}
