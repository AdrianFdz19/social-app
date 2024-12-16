// user.d.ts

export interface User {
    id: string | null;
    username: string;
    email: string;
    profilePictureUrl: string; 
    bannerPictureUrl: string; 
    bio: string; 
    isOnline: string; 
    createdAt: string; 
    updatedAt: string;
}

export interface ProfileType {
    id: string | null;
    username: string;
    email: string;
    pictureUrl: string,
    bannerPictureUrl: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
  }