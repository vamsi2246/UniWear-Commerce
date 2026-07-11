import axios from "axios";
import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export const oauthService = {
  getGoogleAuthUrl(): string {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: CALLBACK_URL,
      client_id: CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
      state: "uniwear_oauth_state", // Standard state token to prevent CSRF
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  },

  async getGoogleProfile(code: string): Promise<GoogleProfile> {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: CALLBACK_URL,
      grant_type: "authorization_code",
    };

    try {
      // 1. Exchange auth code for tokens
      const tokenRes = await axios.post<{ access_token: string; id_token: string }>(
        tokenUrl,
        new URLSearchParams(values).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = tokenRes.data;

      // 2. Fetch user profile using access token
      const profileRes = await axios.get<GoogleProfile>(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return profileRes.data;
    } catch (error: any) {
      console.error("❌ Google OAuth exchange failed:", error.response?.data || error.message);
      throw ApiError.badRequest("Failed to authenticate with Google");
    }
  },

  async handleGoogleUser(profile: GoogleProfile) {
    if (!profile.verified_email) {
      throw ApiError.badRequest("Google account email is not verified");
    }

    // 1. Check if user already exists by email
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (user) {
      // 2. Link Google ID if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: profile.id,
            avatar: user.avatar || profile.picture, // Update avatar if missing
          },
        });
      }
    } else {
      // 3. Create new user
      user = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          role: "USER",
          googleId: profile.id,
          avatar: profile.picture,
        },
      });

      // 4. Set up an empty cart for the new user
      await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  },
};
