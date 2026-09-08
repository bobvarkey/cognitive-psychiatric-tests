CREATE TABLE public.web_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly','yearly')),
  provider TEXT NOT NULL DEFAULT 'razorpay',
  order_id TEXT NOT NULL UNIQUE,
  payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','failed')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX web_subscriptions_email_idx ON public.web_subscriptions (lower(email));

GRANT ALL ON public.web_subscriptions TO service_role;

ALTER TABLE public.web_subscriptions ENABLE ROW LEVEL SECURITY;