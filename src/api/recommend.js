// Backend route is POST /api/recommendation/recommend
const BASE_URL = "http://localhost:5002/api/recommendation/recommend";

export const getCropRecommendation = async (payload) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      try {
        const err = JSON.parse(text);
        throw new Error(err.message || "Recommendation failed");
      } catch (e) {
        if (e instanceof SyntaxError) throw new Error("Recommendation server error. Is the backend running?");
        throw e;
      }
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Recommendation API error:", error);
    throw error;
  }
};