const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 8008;
const TIMEOUT_MS = 500;

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({
      error:
        'Invalid request. "url" query parameter is missing or not an array.',
    });
  }

  try {
    const responses = await Promise.all(urls.map(fetchAndParseJson));
    const mergedNumbers = mergeUnique(responses);
    res.json({ numbers: mergedNumbers });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

async function fetchAndParseJson(url) {
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data.numbers;
  } catch (error) {
    console.log(`Error fetching data from URL: ${url}`);
    return []; // Return empty array if the URL request fails or times out
  }
}

function mergeUnique(arrays) {
  const merger = [].concat(...arrays);
  const unique = Array.from(new Set(merger));
  return unique.sort((a, b) => a - b);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//Run following comand after establishing connection.
//curl "http://localhost:8008/numbers

