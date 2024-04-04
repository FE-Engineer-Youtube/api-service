// whoisParser.js

function parseWhoisResponse(whoisText) {
  // Split the WHOIS response into lines
  const lines = whoisText.split("\n");

  // Initialize an empty object to store WHOIS data
  const whoisData = {};

  let currentKey = "";

  // Parse each line of the WHOIS response
  lines.forEach((line) => {
    // Skip empty lines and comments
    if (!line.trim() || line.startsWith("%")) {
      return;
    }

    // Remove any greater than and less than signs
    line = line.replace(/[<>]/g, "");
    // Remove any leading and trailing whitespace
    line = line.trim();

    // Check if the line contains a colon (':')
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      // Split each line into key-value pairs based on the colon
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Check if the current line belongs to a multi-line value
      if (value.startsWith("http://") || value.startsWith("https://")) {
        // This line is a URL, ignore it as it's not a key-value pair
        return;
      }

      // Concatenate multi-line values
      if (key === "" && currentKey !== "") {
        whoisData[currentKey] += " " + value;
      } else {
        whoisData[key] = value;
        currentKey = key;
      }
    } else {
      // Concatenate multi-line values
      if (currentKey !== "") {
        whoisData[currentKey] += " " + line.trim();
      }
    }
  });

  // Return the optimized JSON data structure
  return {
    "Domain Name": whoisData["Domain Name"],
    "Registry Domain ID": whoisData["Registry Domain ID"],
    "Registrar WHOIS Server": whoisData["Registrar WHOIS Server"],
    "Updated Date": whoisData["Updated Date"],
    "Creation Date": whoisData["Creation Date"],
    "Registry Expiry Date": whoisData["Registry Expiry Date"],
    Registrar: whoisData["Registrar"],
    "Registrar IANA ID": whoisData["Registrar IANA ID"],
    "Registrar Abuse Contact Email": whoisData["Registrar Abuse Contact Email"],
    "Registrar Abuse Contact Phone": whoisData["Registrar Abuse Contact Phone"],
    "Domain Status": whoisData["Domain Status"],
    "Name Server": whoisData["Name Server"],
    DNSSEC: whoisData["DNSSEC"],
    "Last update of whois database": whoisData["Last update of whois database"],
    "Registrar Registration Expiration Date":
      whoisData["Registrar Registration Expiration Date"],
    "Registrant Organization": whoisData["Registrant Organization"],
    "Registrant State/Province": whoisData["Registrant State/Province"],
    "Registrant Country": whoisData["Registrant Country"],
    "Registrant Email": whoisData["Registrant Email"],
    "Admin Organization": whoisData["Admin Organization"],
    "Admin State/Province": whoisData["Admin State/Province"],
    "Admin Country": whoisData["Admin Country"],
    "Admin Email": whoisData["Admin Email"],
    "Tech Organization": whoisData["Tech Organization"],
    "Tech State/Province": whoisData["Tech State/Province"],
    "Tech Country": whoisData["Tech Country"],
    "Tech Email": whoisData["Tech Email"],
  };
}

module.exports = { parseWhoisResponse };
