
-- إنشاء سياسات RLS للسماح بإدراج المستخدمين الجدد
CREATE POLICY "Allow insert for authenticated users" ON public.users
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- السماح للمستخدمين المصرح لهم بقراءة بيانات المستخدمين
CREATE POLICY "Allow select for authenticated users" ON public.users
FOR SELECT 
TO authenticated
USING (true);

-- السماح للمستخدمين المصرح لهم بتحديث بيانات المستخدمين
CREATE POLICY "Allow update for authenticated users" ON public.users
FOR UPDATE 
TO authenticated
USING (true);
