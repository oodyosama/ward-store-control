
-- Create categories table first (referenced by items)
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  type TEXT CHECK (type IN ('raw_material', 'finished_product', 'packaging', 'consumable')) NOT NULL DEFAULT 'raw_material',
  parent_id TEXT REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default categories
INSERT INTO public.categories (id, name, name_en, type) VALUES
  ('cat1', 'مواد خام', 'Raw Materials', 'raw_material'),
  ('cat2', 'منتج نهائي', 'Finished Products', 'finished_product'),
  ('cat3', 'مواد تغليف', 'Packaging Materials', 'packaging');

-- Create items table
CREATE TABLE public.items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  qr_code TEXT,
  category_id TEXT REFERENCES public.categories(id) NOT NULL,
  unit TEXT NOT NULL,
  min_quantity INTEGER NOT NULL DEFAULT 0,
  max_quantity INTEGER,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE,
  batch_number TEXT,
  supplier TEXT,
  location TEXT,
  images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create warehouses table
CREATE TABLE public.warehouses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  code TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  manager TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample warehouses
INSERT INTO public.warehouses (id, name, name_en, code, address, manager, phone, email, is_active, capacity) VALUES
  ('wh1', 'المخزن الرئيسي', 'Main Warehouse', 'WH001', 'الرياض، حي الصناعية', 'أحمد محمد', '0501234567', 'main@warehouse.com', true, 10000),
  ('wh2', 'مخزن الفرع الثاني', 'Branch 2 Warehouse', 'WH002', 'جدة، حي الفيصلية', 'فاطمة أحمد', '0507654321', 'branch2@warehouse.com', true, 5000);

-- Create stocks table
CREATE TABLE public.stocks (
  id TEXT PRIMARY KEY,
  item_id TEXT REFERENCES public.items(id) NOT NULL,
  warehouse_id TEXT REFERENCES public.warehouses(id) NOT NULL,
  zone_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  batch_number TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id, warehouse_id, batch_number)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('inbound', 'outbound', 'transfer', 'adjustment', 'return')) NOT NULL,
  item_id TEXT REFERENCES public.items(id) NOT NULL,
  warehouse_id TEXT REFERENCES public.warehouses(id) NOT NULL,
  target_warehouse_id TEXT REFERENCES public.warehouses(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  batch_number TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  reference TEXT,
  notes TEXT,
  user_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update available_quantity when quantity or reserved_quantity changes
CREATE OR REPLACE FUNCTION update_available_quantity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.available_quantity = NEW.quantity - NEW.reserved_quantity;
    NEW.total_value = NEW.quantity * NEW.unit_price;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stocks_available_quantity BEFORE INSERT OR UPDATE ON public.stocks
    FOR EACH ROW EXECUTE FUNCTION update_available_quantity();

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a warehouse management system)
CREATE POLICY "Allow all operations on categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on items" ON public.items FOR ALL USING (true);
CREATE POLICY "Allow all operations on warehouses" ON public.warehouses FOR ALL USING (true);
CREATE POLICY "Allow all operations on stocks" ON public.stocks FOR ALL USING (true);
CREATE POLICY "Allow all operations on transactions" ON public.transactions FOR ALL USING (true);
