export async function detectLanguage(text: string) {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lang-detect`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ text }),
            }
        );

        const data = await res.json();
        return data.language || "en";
    } catch (err) {
        console.error("Language detect error:", err);
        return "en";
    }
}
