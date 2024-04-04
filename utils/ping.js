function parsePingResponse(pingData) {
  // Extract relevant data from stdout
  const lines = pingData.split("\n");
  // Extract packet loss percentage and packets transmitted/received
  const packetLossLine = lines.find((line) => line.includes("% packet loss"));
  const packetLossPercentageMatch = packetLossLine.match(/(\d+)% packet loss/);
  const packetLossPercentage = packetLossPercentageMatch
    ? parseInt(packetLossPercentageMatch[1])
    : 0;

  const packetsLine = lines.find((line) =>
    line.includes("packets transmitted")
  );
  const packetsMatch = packetsLine.match(
    /(\d+) packets transmitted, (\d+) received/
  );
  const packetsTransmitted = packetsMatch ? parseInt(packetsMatch[1]) : 0;
  const packetsReceived = packetsMatch ? parseInt(packetsMatch[2]) : 0;

  // Extract round-trip time statistics
  const rttStatsLine = lines.find((line) =>
    line.includes("rtt min/avg/max/mdev")
  );
  const rttStatsMatch = rttStatsLine.match(
    /(\d+\.\d+)\/(\d+\.\d+)\/(\d+\.\d+)\/(\d+\.\d+) ms/
  );
  const minPing = parseFloat(rttStatsMatch[1]);
  const avgPing = parseFloat(rttStatsMatch[2]);
  const maxPing = parseFloat(rttStatsMatch[3]);
  // Since the standard deviation is not used in the response format, we omit it

  // Format data as JSON
  return {
    packetsTransmitted: packetsTransmitted,
    packetsReceived: packetsReceived,
    packetLossPercentage: packetLossPercentage,
    minPing: minPing.toFixed(2),
    maxPing: maxPing.toFixed(2),
    averagePing: avgPing.toFixed(2),
  };
}

module.exports = { parsePingResponse };
