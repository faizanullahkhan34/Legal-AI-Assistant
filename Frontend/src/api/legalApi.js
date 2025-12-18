import axios from "axios";

export async function askLegalBot(query, language, location, userName) {
    const res = await axios.post("http://localhost:8000/legal-query", {
        query,
        language,
        city: location,
        user_name: userName // Optional
    });

    return res.data;
}
