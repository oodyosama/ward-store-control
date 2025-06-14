
-- تحديث قيود الفحص للسماح بدور "cashier"
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'manager', 'warehouse_keeper', 'accountant', 'cashier'));
