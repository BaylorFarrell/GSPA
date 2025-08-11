var customParamsRaw = "";

function updateCustomParams() {
  chrome.storage.sync.get("params", function(data) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving params:", chrome.runtime.lastError);
      return;
    }
    customParamsRaw = data.params || "";
    console.log("Custom Params Updated:", customParamsRaw);
  });
}

updateCustomParams();

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === "sync" && changes.params) {
    customParamsRaw = changes.params.newValue || "";
    console.log("Custom Params Changed:", customParamsRaw);
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Intercepting:", details.url);

    if (!customParamsRaw.trim()) return {};

    let lines = customParamsRaw
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line);

    if (lines.length === 0) return {};

    let queryStr = lines.join('&');
    let customParamsObj = new URLSearchParams(queryStr);

    let url = new URL(details.url);
    let changed = false;


    for (const [key, value] of customParamsObj.entries()) {
      if (!url.searchParams.has(key)) {
        url.searchParams.append(key, value);
        changed = true;
      }
    }

    if (changed) {
      let newUrl = url.toString();
      console.log("Redirecting to:", newUrl);
      return { redirectUrl: newUrl };
    }

    return {};
  },
  { urls: ["*://www.google.com/search*"] },
  ["blocking"]
);
