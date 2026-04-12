function loadVisitorCount() {
  fetch("https://pxfm85ox10.execute-api.us-east-1.amazonaws.com/count", {
    method: "POST"
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.views !== undefined) {
      document.getElementById("visitor-count").innerText = "This page has been viewed " + data.views +  " times";
    } else {
      document.getElementById("visitor-count").innerText = "";
    }
  })
  .catch(error => {
    console.error("Could not load visitor count:", error);
    document.getElementById("visitor-count").innerText = "";
  });
}

loadVisitorCount();