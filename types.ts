
export type AspectRatio = '1:1' | '16:9' | '9:16';

export interface GeneratedImage {
  url: string; // data URL for display
  data: string; // raw base64 data for download
}
