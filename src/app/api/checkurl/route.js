import fetch from "node-fetch"

export async function POST(request) {
    try {
        const { url } = await request.json()
        if (!url) {
            return new Response(JSON.stringify({ error: "Missing url parameter" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }
        // Fetch only the HEAD for headers
        const response = await fetch(url, { method: "HEAD" })
        if (response.status !== 200) {
            // If status is not 200, treat as not embeddable
            return new Response(JSON.stringify({ embeddable: false }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        }
        const xFrameOptions = response.headers.get("X-Frame-Options") || ""
        const contentSecurityPolicy = response.headers.get("Content-Security-Policy") || ""
        const notEmbeddable =
            xFrameOptions.toLowerCase().includes("deny") ||
            xFrameOptions.toLowerCase().includes("sameorigin") ||
            contentSecurityPolicy.toLowerCase().includes("frame-ancestors 'none'")
        return new Response(JSON.stringify({ embeddable: !notEmbeddable }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        // If fetch fails, treat as not embeddable
        return new Response(JSON.stringify({ embeddable: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    }
}
