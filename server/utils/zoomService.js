import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class ZoomService {
  constructor() {
    this.zoomApiUrl = 'https://api.zoom.us/v2';
    this.clientId = process.env.ZOOM_CLIENT_ID;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
    this.isConfigured = this.clientId && this.clientSecret &&
                        this.clientId !== 'your_zoom_client_id_here' &&
                        this.clientSecret !== 'your_zoom_client_secret_here';

    if (!this.isConfigured) {
      console.warn('⚠️ Zoom credentials not configured - will use placeholder meeting links');
    }
  }

  // Generate Zoom JWT token
  generateJWT() {
    const payload = {
      iss: this.clientId,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
    };
    return jwt.sign(payload, this.clientSecret, { algorithm: 'HS256' });
  }

  // Create Zoom meeting for 1:1 booking
  async create1on1Meeting(meetingData) {
    // If Zoom is not configured, return a placeholder
    if (!this.isConfigured) {
      return {
        meetingId: `placeholder-${Date.now()}`,
        joinUrl: `https://zoom.us/j/placeholder?pwd=meeting${Date.now()}`,
        startUrl: `https://zoom.us/s/placeholder?pwd=meeting${Date.now()}`,
        password: 'NotConfigured',
      };
    }

    try {
      const token = this.generateJWT();
      const response = await axios.post(
        `${this.zoomApiUrl}/users/me/meetings`,
        {
          topic: meetingData.title,
          type: 1, // Instant meeting
          duration: meetingData.duration,
          timezone: 'UTC',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: false,
            waiting_room: false,
            approval_type: 0,
            auto_recording: 'none',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        meetingId: response.data.id,
        joinUrl: response.data.join_url,
        startUrl: response.data.start_url,
        password: response.data.password || '',
      };
    } catch (err) {
      console.error('Error creating Zoom meeting:', err);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  // Create Zoom webinar for large groups (100+)
  async createWebinar(webinarData) {
    try {
      const token = this.generateJWT();
      const startTime = new Date(webinarData.scheduledDate).toISOString();

      const response = await axios.post(
        `${this.zoomApiUrl}/users/me/webinars`,
        {
          topic: webinarData.title,
          description: webinarData.description,
          start_time: startTime,
          duration: webinarData.duration,
          timezone: 'UTC',
          type: 5, // Webinar
          settings: {
            host_video: true,
            panelists_video: true,
            attendees_video: true,
            practice_session: false,
            hd_video: true,
            approval_type: 0,
            on_demand: false,
            make_host_default: false,
            enforce_login: false,
            enforce_login_domains: '',
            alternative_hosts: '',
            close_registration: false,
            show_share_button: true,
            allow_multiple_devices: true,
            waiting_room: false,
            auto_recording: 'cloud',
            registrants_confirmation_email: true,
            recording_alert: true,
            meeting_authentication: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        webinarId: response.data.id,
        registrationUrl: response.data.registration_url,
        joinUrl: response.data.join_url,
        startUrl: response.data.start_url,
      };
    } catch (err) {
      console.error('Error creating Zoom webinar:', err);
      throw new Error('Failed to create Zoom webinar');
    }
  }

  // Get meeting details
  async getMeetingDetails(meetingId) {
    try {
      const token = this.generateJWT();
      const response = await axios.get(`${this.zoomApiUrl}/meetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error fetching meeting details:', err);
      throw new Error('Failed to fetch meeting details');
    }
  }

  // Get webinar details
  async getWebinarDetails(webinarId) {
    try {
      const token = this.generateJWT();
      const response = await axios.get(`${this.zoomApiUrl}/webinars/${webinarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error fetching webinar details:', err);
      throw new Error('Failed to fetch webinar details');
    }
  }

  // Get meeting recordings
  async getMeetingRecordings(meetingId) {
    try {
      const token = this.generateJWT();
      const response = await axios.get(
        `${this.zoomApiUrl}/meetings/${meetingId}/recordings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.recording_files || [];
    } catch (err) {
      console.error('Error fetching recordings:', err);
      return [];
    }
  }

  // Update meeting status
  async updateMeetingStatus(meetingId, action) {
    try {
      const token = this.generateJWT();
      const response = await axios.put(
        `${this.zoomApiUrl}/meetings/${meetingId}/status`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error('Error updating meeting status:', err);
      throw new Error('Failed to update meeting status');
    }
  }

  // Get webinar registrants (for paid webinars)
  async getWebinarRegistrants(webinarId) {
    try {
      const token = this.generateJWT();
      const response = await axios.get(
        `${this.zoomApiUrl}/webinars/${webinarId}/registrants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.registrants || [];
    } catch (err) {
      console.error('Error fetching registrants:', err);
      return [];
    }
  }

  // Generate Zoom signature for client-side SDK (deprecated but available)
  generateSignature(meetingNumber, role) {
    const signature = require('jsrsasign');
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const oPayload = {
      sdkKey: this.clientId,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    return signature.jws.JWS.sign('HS256', sHeader, sPayload, this.clientSecret);
  }
}

export default new ZoomService();
