/**
 * downloadFile — robust cross-origin & same-origin Blob download helper.
 *
 * Fetches the target file via Fetch API, extracts the Content-Disposition filename if available,
 * converts the response to a Blob with proper MIME type, creates a Blob URL,
 * attaches it to a temporary hidden anchor element, triggers click download,
 * and revokes the Blob URL.
 */

export async function downloadFile(url, filename) {
    if (!url) return;
    try {
        // Normalize URL: replace any legacy /uploads/ with /api/download/
        let targetUrl = url.replace(/\/uploads\//g, "/api/download/");

        // If URL is relative and process.env.NEXT_PUBLIC_API_URL is configured, handle prefix
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
        if (targetUrl.startsWith("/") && apiBase) {
            targetUrl = `${apiBase.replace(/\/$/, "")}${targetUrl}`;
        }

        // Append ?name= query param if filename is provided so backend sets Content-Disposition header
        const sep = targetUrl.includes("?") ? "&" : "?";
        const fetchUrl = filename ? `${targetUrl}${sep}name=${encodeURIComponent(filename)}` : targetUrl;

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        // Try to parse filename from Content-Disposition header if not provided
        let saveFilename = filename;
        if (!saveFilename) {
            const disposition = response.headers.get("Content-Disposition");
            if (disposition) {
                const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
                if (match && match[1]) {
                    saveFilename = decodeURIComponent(match[1]);
                }
            }
        }
        if (!saveFilename) {
            saveFilename = targetUrl.split("?")[0].split("/").pop() || "downloaded_file";
        }

        // Create Blob with response Content-Type
        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        a.download = saveFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Delay revoke so browser starts download safely
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
        console.error("[downloadFile] Download failed:", err);
    }
}

