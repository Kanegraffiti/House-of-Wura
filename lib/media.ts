import media from '@/data/media.json';

export type MediaKey = keyof typeof media;

export function getMedia(key: MediaKey) {
  return media[key];
}
