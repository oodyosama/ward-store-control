export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          name_en: string | null
          parent_id: string | null
          tenant_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          name: string
          name_en?: string | null
          parent_id?: string | null
          tenant_id?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          name_en?: string | null
          parent_id?: string | null
          tenant_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          barcode: string | null
          batch_number: string | null
          category_id: string
          created_at: string
          description: string | null
          expiry_date: string | null
          id: string
          images: string[] | null
          is_active: boolean
          location: string | null
          max_quantity: number | null
          min_quantity: number
          name: string
          name_en: string | null
          qr_code: string | null
          sku: string
          supplier: string | null
          tenant_id: string | null
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          batch_number?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id: string
          images?: string[] | null
          is_active?: boolean
          location?: string | null
          max_quantity?: number | null
          min_quantity?: number
          name: string
          name_en?: string | null
          qr_code?: string | null
          sku: string
          supplier?: string | null
          tenant_id?: string | null
          unit: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          batch_number?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          location?: string | null
          max_quantity?: number | null
          min_quantity?: number
          name?: string
          name_en?: string | null
          qr_code?: string | null
          sku?: string
          supplier?: string | null
          tenant_id?: string | null
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks: {
        Row: {
          available_quantity: number
          batch_number: string | null
          expiry_date: string | null
          id: string
          item_id: string
          last_updated: string
          quantity: number
          reserved_quantity: number
          tenant_id: string | null
          total_value: number
          unit_price: number
          warehouse_id: string
          zone_id: string | null
        }
        Insert: {
          available_quantity?: number
          batch_number?: string | null
          expiry_date?: string | null
          id: string
          item_id: string
          last_updated?: string
          quantity?: number
          reserved_quantity?: number
          tenant_id?: string | null
          total_value?: number
          unit_price?: number
          warehouse_id: string
          zone_id?: string | null
        }
        Update: {
          available_quantity?: number
          batch_number?: string | null
          expiry_date?: string | null
          id?: string
          item_id?: string
          last_updated?: string
          quantity?: number
          reserved_quantity?: number
          tenant_id?: string | null
          total_value?: number
          unit_price?: number
          warehouse_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stocks_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stocks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stocks_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          is_tenant_owner: boolean
          last_name: string | null
          phone: string | null
          tenant_id: string | null
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_tenant_owner?: boolean
          last_name?: string | null
          phone?: string | null
          tenant_id?: string | null
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_tenant_owner?: boolean
          last_name?: string | null
          phone?: string | null
          tenant_id?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_login: string | null
          permissions: string[]
          role: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          permissions?: string[]
          role?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          permissions?: string[]
          role?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          settings: Json | null
          subscription_plan: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          settings?: Json | null
          subscription_plan?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          settings?: Json | null
          subscription_plan?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          batch_number: string | null
          completed_at: string | null
          created_at: string
          expiry_date: string | null
          id: string
          item_id: string
          notes: string | null
          quantity: number
          reference: string | null
          status: string
          target_warehouse_id: string | null
          tenant_id: string | null
          total_value: number
          type: string
          unit_price: number
          user_id: string
          warehouse_id: string
        }
        Insert: {
          batch_number?: string | null
          completed_at?: string | null
          created_at?: string
          expiry_date?: string | null
          id: string
          item_id: string
          notes?: string | null
          quantity: number
          reference?: string | null
          status?: string
          target_warehouse_id?: string | null
          tenant_id?: string | null
          total_value?: number
          type: string
          unit_price?: number
          user_id: string
          warehouse_id: string
        }
        Update: {
          batch_number?: string | null
          completed_at?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          reference?: string | null
          status?: string
          target_warehouse_id?: string | null
          tenant_id?: string | null
          total_value?: number
          type?: string
          unit_price?: number
          user_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_target_warehouse_id_fkey"
            columns: ["target_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          permissions: string[]
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          permissions?: string[]
          role?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          permissions?: string[]
          role?: string
          username?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: string
          capacity: number | null
          code: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          manager: string
          name: string
          name_en: string | null
          phone: string | null
          tenant_id: string | null
        }
        Insert: {
          address: string
          capacity?: number | null
          code: string
          created_at?: string
          email?: string | null
          id: string
          is_active?: boolean
          manager: string
          name: string
          name_en?: string | null
          phone?: string | null
          tenant_id?: string | null
        }
        Update: {
          address?: string
          capacity?: number | null
          code?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager?: string
          name?: string
          name_en?: string | null
          phone?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_tenant_with_owner: {
        Args: {
          tenant_name: string
          owner_email: string
          owner_password: string
          owner_username: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
