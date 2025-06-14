
-- إنشاء دالة للتحقق من بيانات تسجيل دخول المدير
CREATE OR REPLACE FUNCTION public.validate_admin_login(
  input_username TEXT,
  input_password TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من وجود المدير مع اسم المستخدم وكلمة المرور المطابقة
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_credentials 
    WHERE username = input_username 
    AND password_hash = crypt(input_password, password_hash)
  );
END;
$$;

-- إنشاء دالة لتحديث بيانات المدير
CREATE OR REPLACE FUNCTION public.update_admin_credentials(
  new_username TEXT,
  new_password TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- تحديث بيانات المدير (افتراض وجود سجل واحد فقط)
  UPDATE public.admin_credentials 
  SET 
    username = new_username,
    password_hash = crypt(new_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = (SELECT id FROM public.admin_credentials LIMIT 1);
  
  -- التحقق من نجاح التحديث
  RETURN FOUND;
END;
$$;
