import platform from "platform";

export const getUserDeviceInfo = async () => {
  const browser = platform.name || "Unknown";
  const os = platform.os?.family || "Unknown";

  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const { ip } = await response.json();
    return { browser, os, ip };
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return { browser, os, ip: "Unknown" };
  }
};