/**
 * Fetches the visitor count from the API and updates the page.
 *
 * The API endpoint (`__COUNT_API_ENDPOINT__`) is a placeholder replaced at
 * deploy time by a GitHub Actions workflow step using a repository secret.
 * The endpoint points to an AWS API Gateway route backed by a Lambda function
 * that increments a DynamoDB counter and returns the updated view count.
 *
 * On success: updates the `#visitor-count` element with the total view count
 * returned in `data.views`.
 *
 * On failure (non-OK HTTP response, missing `views` field, or network error):
 * logs the error to the console and displays "Counter not available." in the
 * `#visitor-count` element.
 */
function loadVisitorCount() {
  fetch('__COUNT_API_ENDPOINT__', {
    method: 'POST',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.views !== undefined) {
        document.getElementById('visitor-count').innerText =
          'This page has been viewed ' + data.views + ' times';
      } else {
        document.getElementById('visitor-count').innerText =
          'This page has been viewed: Counter not available.';
      }
    })
    .catch((error) => {
      console.error('Could not load visitor count:', error);
      document.getElementById('visitor-count').innerText =
        'This page has been viewed: Counter not available.';
    });
}

loadVisitorCount();
