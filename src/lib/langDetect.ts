import { supabase } from "@/integrations/supabase/client";

export async function detectLanguage(text: string) {
    try {
        const { data, error } = await supabase.functions.invoke("lang-detect", {
            body: { text: text.trim() }
        });

        console.log("API RESPONSE:", data); // 🔍 debug

        if (error || !data || data.error) {
            return "unknown";
        }

        return data.language || "unknown";

    } catch (err) {
        console.error("Language detect error:", err);
        return "unknown"; // ❗ not "en"
    }
}
