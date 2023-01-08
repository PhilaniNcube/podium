export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

  export type Address = {
    phone_number: string,
    street: string,
    suburb: string,
    city: string,
    postal_code: string,
  }

  export type ImageObject = {
    url: string
    width: number
    height: number
  }

  export type Brand = {
    id: string,
    created_at: string,
    name: string,
    slug: string,
    image: ImageObject
  }

  export type Category = {
    id: string,
    created_at: string,
    name: string,
    slug: string,
    image: ImageObject
  }

  export type SubCategory = {
    id: string,
    name: string,
    slug: string,
    parent: Category
  }

  export type Details ={
    name: string,
    value: string,
  }

  export type Supplier = {
    id: string,
    created_at: string,
    name: string,
    slug: string,
    contact: string,
    email: string
  }


export interface Database {
  public : {
    Tables: {

      supplier: {
        Row: {
            id: string,
            created_at: string,
            name: string,
            slug: string,
            contact: string,
            email: string
        }
        Update: {
            id?: string,
            created_at?: string,
            name?: string,
            slug?: string,
            contact?: string,
            email?: string
        }
        Insert: {
            id?: string,
            created_at?: string,
            name?: string,
            slug?: string,
            contact?: string,
            email?: string
        }
      }
      products: {
        Row: {
          id: string,
          created_at: string,
          name: string,
          description: string,
          brand: Brand,
          slug: string,
          category: Category,
          details: Details[],
          refund_policy: string,
          rating: number,
          shipping: number,
          sub_category: SubCategory,
          images: ImageObject[],
          price: number,
          cost: number,
          featured: boolean,
          in_stock: boolean,
          published: boolean,
          warranty: string,
          supplier: Supplier,
          product_code: string
        }
        Update: {
          id?: string,
          created_at?: string,
          name?: string,
          description?: string,
          brand?: string,
          slug?: string,
          category?: string,
          details?:  Array<{
                      key: string;
                      value: string;
                    }>,
          refund_policy?: string,
          rating?: number,
          shipping?: number,
          sub_category?: string,
          images?: ImageObject[],
          price?: number,
          cost?: number,
          featured?: boolean,
          in_stock?: boolean,
          published?: boolean,
          warranty?: string
          supplier?: string,
          product_code?: string
        }
        Insert: {
          id?: string,
          created_at?: string,
          name?: string,
          description?: string,
          brand?: string,
          slug?: string,
          category?: string,
          details?:  Array<{
                      key: string;
                      value: string;
                    }>,
          refund_policy?: string,
          rating?: number,
          shipping?: number,
          sub_category?: string,
          images?: ImageObject[],
          price?: number,
          cost?: number,
          featured?: boolean,
          in_stock?: boolean,
          published?: boolean,
          warranty?: string,
          supplier?: string,
          product_code?: string
        }
      }
      categories: {
        Row: {
            id?: string,
            created_at: string,
            name: string,
            slug: string,
            image: ImageObject
        }
        Update: {
            id?: string,
            created_at?: string,
            name?: string,
            slug?: string,
            image?: ImageObject
        }
        Insert: {
            id?: string,
            created_at?: string,
            name?: string,
            slug?: string,
            image?: ImageObject
        }
      }
      brands: {
        Row: {
            id: string,
            created_at: string,
            name: string,
            slug: string,
            image: ImageObject
        }
        Update: {
            id?: string,
            created_at?: string,
            name?: string,
            slug?: string,
            image?: ImageObject
        }
        Insert: {
            id?: string,
            created_at?: string,
            name?: string,
            slug?: string,
            image?: ImageObject
        }
      }
      sub_category: {
        Row: {
          id: string,
          name: string,
          slug: string,
          parent: Category
        }
        Update: {
          id?: string,
          name?: string,
          slug?: string,
          parent?: string,
        }
        Insert: {
          id?: string,
          name?: string,
          slug?: string,
          parent?: string,
        }
      }
      profiles: {
        Row : {
          id: string,
          created_at: string,
          email: string,
          first_name: string,
          last_name: string,
          image: string,
          address: Address,
          role: {
            id: string,
            role: string
          }
        }
        Update: {
          id?: string,
          created_at?: string,
          email?: string,
          first_name?: string,
          last_name?: string,
          image?: string,
          address?: Address,
          role?: {
            id: string,
            role: string
          }
        }
        Insert: {
          id?: string,
          created_at?: string,
          email?: string,
          first_name?: string,
          last_name?: string,
          image?: string,
          address?: Address,
          role?: {
            id: string,
            role: string
          }
        }
      }
      roles: {
        Row: {
          id: string,
          role: "user" | "seller" | "admin",
        }
        Insert: {
          id?: string,
          role?: "user" | "seller" | "admin",
        }
        Update: {
          id?: string,
          role?: "user" | "seller" | "admin"
        }
      }
      admins: {
        Row: {
          id:string,
          created_at:string,
          user_id:string,
        }
        Update: {
          id?:string,
          created_at?:string,
          user_id?:string,
        }
        Insert: {
          id?:string,
          created_at?:string,
          user_id?:string,
        }

      }
    }
    Views : {
      [_ in never]: never
    }
     Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


export type ProductType = Database["public"]["Tables"]["products"]["Row"]
export type CategoryType = Database["public"]["Tables"]["categories"]["Row"]
export type SubCategoryType = Database["public"]["Tables"]["sub_category"]["Row"]
export type SupplierType = Database["public"]["Tables"]["supplier"]["Row"]
export type BrandType = Database["public"]["Tables"]["brands"]["Row"]
export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"]
export type AdminType = Database["public"]["Tables"]["admins"]["Row"]
