/**
 * downloadFile — cross-origin safe download helper.
 *
 * The HTML `download` attribute is ONLY respected for same-origin URLs.
 * When the frontend (port 3000) links to the backend (port 4000) the browser
 * silently ignores the `download` attribute and falls back to the raw
 * Content-Disposition filename — which is a UUID.
 *
 * Fix: fetch the file via the Fetch API (same-origin through Next.js proxy),
 * convert the response to a Blob, create an object URL, attach it to a
 * temporary <a> element with the desired filename, click it, then revoke
 * the object URL to free memory.
 *
 * The `?name=` query param tells FastAPI's /api/download/<file> endpoint to
 * set Content-Disposition: attachment; filename="<name>" so the server-side
 * header also matches — useful for any direct URL access.
 */

export async function downloadFile(url, filename) {
    try {
        // Append ?name= so FastAPI echoes the correct filename in Content-Disposition
        const sep = url.includes("?") ? "&" : "?";
        const fetchUrl = filename ? `${url}${sep}name=${encodeURIComponent(filename)}` : url;

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        // Use the Content-Type from the response so the Blob has the correct MIME type
        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Delay revoke so browser has time to start the download
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch (err) {
        console.error("[downloadFile] Failed:", err);
        // Fallback: open in new tab
        window.open(url, "_blank");
    }
}
