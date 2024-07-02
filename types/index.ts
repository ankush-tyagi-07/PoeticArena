/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

export interface GeneratePoetryProps {
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
}

export interface PoetryCardProps {
  imgUrl: string;
  title: string;
  description: string;
  poetryId: Id<"poetries">;
}


export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface PoetryDetailPlayerProps {
  audioUrl: string;
  poetryTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string
  poetryId: Id<"poetries">;
  imageStorageId: Id<"_storage"> | null;
  audioStorageId: Id<"_storage">| null;
  authorImageUrl: string;
  authorId: string;
}

export interface TopPoetsProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageURL: string;
  clerkId: string;
  name: string;
  poetry: {
    poetryTitle: string;
    poetryId: Id<"poetries">;
  }[];
  totalPoetries: number;
}


export interface CarouselProps {
  fansLikeDetail: TopPoetsProps[];
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  poetryId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface PoetryProps {
  _id: Id<"poetries">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  poetryTitle: string;
  poetryDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  audioDuration: number;
  views: number;
}

export interface ProfilePoetryProps {
  poetries: PoetryProps[];
  listeners: number;
}

export interface ProfileCardProps {
  poetryData: ProfilePoetryProps;
  imageUrl: string;
  userFirstName: string;
}