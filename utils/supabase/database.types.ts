export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          ticket_id: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["Status"]
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status: Database["public"]["Enums"]["Status"]
          title?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["Status"]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["Role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: "ADMIN" | "END-USER"
      Status: "NEW" | "IN-PROGRESS" | "RESOLVED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]