
export const getUserDeviceInfo = async () => {
  const browser = getBrowserName();
  const os = getPlatformFromUserAgent();

  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const { ip } = await response.json();
    return { browser, os, ip };
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return { browser, os, ip: "Unknown" };
  }
};

function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
  return "Unknown";
}

function getPlatformFromUserAgent() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "MacOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  return "Unknown";
}
 export const getUserDetails = async () => {
      const { browser, os, ip } = await getUserDeviceInfo();
      return {
        browser: browser,
        os: os,
        ipAddress: ip,
      };
 }