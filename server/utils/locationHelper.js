import geoip from 'geoip-lite';

/**
 * Get location from IP address
 */
const getLocationFromIP = (ip) => {
  try {
    // Handle localhost/development
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      return 'Local Development';
    }

    // Clean IP (remove ::ffff: prefix for IPv4-mapped IPv6)
    const cleanIP = ip.replace('::ffff:', '');

    const geo = geoip.lookup(cleanIP);

    if (geo) {
      const location = [];
      if (geo.city) location.push(geo.city);
      if (geo.region) location.push(geo.region);
      if (geo.country) location.push(geo.country);

      return location.length > 0 ? location.join(', ') : 'Unknown Location';
    }

    return 'Unknown Location';
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return 'Unknown Location';
  }
};

/**
 * Get device info from user agent
 */
const getDeviceFromUserAgent = (userAgent) => {
  try {
    if (!userAgent) return 'Unknown Device';

    // Detect device type
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);

    let deviceType = 'Desktop';
    if (isTablet) deviceType = 'Tablet';
    else if (isMobile) deviceType = 'Mobile';

    // Detect OS
    let os = 'Unknown OS';
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac OS X/i.test(userAgent)) os = 'macOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iOS|iPhone|iPad/i.test(userAgent)) os = 'iOS';

    // Detect browser
    let browser = 'Unknown Browser';
    if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = 'Chrome';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Edg/i.test(userAgent)) browser = 'Edge';
    else if (/Opera|OPR/i.test(userAgent)) browser = 'Opera';

    return `${deviceType} • ${os} • ${browser}`;
  } catch (error) {
    console.error('Error parsing user agent:', error);
    return 'Unknown Device';
  }
};

/**
 * Get client IP address from request
 */
const getClientIP = (req) => {
  try {
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      'Unknown'
    );
  } catch (error) {
    console.error('Error getting client IP:', error);
    return 'Unknown';
  }
};

export {
  getLocationFromIP,
  getDeviceFromUserAgent,
  getClientIP,
};
export default {
  getLocationFromIP,
  getDeviceFromUserAgent,
  getClientIP,
};
