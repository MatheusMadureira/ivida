import type { ObjectId } from "mongodb";

export interface UserSecurity {
  emailVerified: boolean;
  lastPasswordChange: Date | null;
  passwordResetCode: string | null; // hash do código
}

export interface UserProfile {
  photoUrl: string | null;
}

export interface UserTimestamps {
  createdAt: Date | null;
  updatedAt: Date | null;
  lastLoginAt: Date | null;
}

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  /** Hash do CPF (não armazenamos o CPF em texto). */
  cpfHash?: string;
  passwordHash: string;
  roles: string[];
  status: "ACTIVE" | "INACTIVE";
  profile: UserProfile;
  security: UserSecurity;
  timestamps: UserTimestamps;
}
