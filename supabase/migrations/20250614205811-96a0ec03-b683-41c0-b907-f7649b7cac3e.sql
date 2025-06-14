
-- إنشاء جدول لحفظ بيانات المدير المحدثة
CREATE TABLE public.admin_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة Row Level Security
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- السماح بكافة العمليات (لأن هذا للمدير فقط)
CREATE POLICY "Allow all operations on admin_credentials" 
ON public.admin_credentials 
FOR ALL 
USING (true);

-- إدراج بيانات المدير الافتراضية
INSERT INTO public.admin_credentials (username, password_hash)
VALUES ('admin', crypt('admin', gen_salt('bf')));
