import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

interface Category {
  id: number;
  name_it: string;
  name_en: string;
  emoji: string;
}

export const SupabaseTest = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔄 Testing Supabase connection...");

        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order");

        if (error) {
          console.error("❌ Supabase error:", error);
          setError(error.message);
        } else {
          console.log("✅ Supabase data:", data);
          setCategories(data || []);
        }
      } catch (err) {
        console.error("❌ Connection error:", err);
        setError("Errore connessione Supabase");
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "20px", color: "#4a5568", fontSize: "1.1rem" }}>
        🔄 Testing Supabase connection...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          padding: "20px",
          color: "#e53e3e",
          fontSize: "1.1rem",
          background: "#fed7d7",
          borderRadius: "8px",
          margin: "20px",
        }}
      >
        ❌ Error: {error}
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          color: "#38a169",
          fontSize: "1.5rem",
          marginBottom: "15px",
          fontWeight: "600",
        }}
      >
        ✅ Supabase Connected!
      </h2>
      <h3
        style={{ color: "#1a202c", fontSize: "1.2rem", marginBottom: "15px" }}
      >
        Categories from database ({categories.length}):
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              margin: "10px 0",
              padding: "10px 15px",
              background: "#f7fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              color: "#2d3748",
              fontSize: "1rem",
            }}
          >
            {cat.emoji} <strong>{cat.name_en}</strong> / {cat.name_it}
          </li>
        ))}
      </ul>
    </div>
  );
};
