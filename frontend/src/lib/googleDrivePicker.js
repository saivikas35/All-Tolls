let pickerApiLoaded = false;

/* ---------------- Load Google APIs ---------------- */
export function loadGooglePicker() {
  return new Promise((resolve, reject) => {
    if (pickerApiLoaded) return resolve();

    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.onload = () => {
      window.gapi.load("picker", () => {
        pickerApiLoaded = true;
        resolve();
      });
    };
    gapiScript.onerror = reject;
    document.body.appendChild(gapiScript);
  });
}

/* ---------------- Open Picker ---------------- */
export function openGoogleDrivePicker({
  clientId,
  apiKey,
  onPick,
}) {
  if (!window.google || !window.google.accounts) {
    alert("Google Identity Services not loaded");
    return;
  }

  /* ---------- Step 1: Get OAuth Token ---------- */
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    callback: (tokenResponse) => {
      if (!tokenResponse.access_token) {
        alert("Failed to get access token");
        return;
      }

      /* ---------- Step 2: Open Picker ---------- */
      const view = new window.google.picker.DocsView()
        .setIncludeFolders(false)
        .setSelectFolderEnabled(false);

      const picker = new window.google.picker.PickerBuilder()
        .setDeveloperKey(apiKey)
        .setOAuthToken(tokenResponse.access_token)
        .addView(view)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            onPick({
              name: file.name,
              id: file.id,
              url: file.url,
            });
          }
        })
        .build();

      picker.setVisible(true);
    },
  });

  tokenClient.requestAccessToken({ prompt: "consent" });
}
