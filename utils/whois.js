// whoisParser.js

function parseWhoisResponse(whoisText) {
  // Split the WHOIS response into lines
  const lines = whoisText.split("\n");

  // Initialize an empty object to store WHOIS data
  const whoisData = {};

  // Parse each line of the WHOIS response
  lines.forEach((line) => {
    // Skip empty lines and comments
    if (!line.trim() || line.startsWith("%")) {
      return;
    }

    // Split each line into key-value pairs
    const parts = line.split(":").map((part) => part.trim());
    const key = parts.shift();
    const value = parts.join(":").trim();

    // Add key-value pair to the WHOIS data object
    if (key in whoisData) {
      // If the key already exists, convert the value to an array
      if (!Array.isArray(whoisData[key])) {
        whoisData[key] = [whoisData[key]];
      }
      whoisData[key].push(value);
    } else {
      whoisData[key] = value;
    }
  });

  return whoisData;
}

module.exports = { parseWhoisResponse };
