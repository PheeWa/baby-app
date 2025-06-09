export type FeedingType = "left breast" | "right breast" | "bottle" | "meal";

export interface Feeding {
  id: string;
  type: FeedingType;
  details: string;
  start: string;
  finish: string;
  amount?: number;
  contents?: string;

}

export interface CreateFeedingInput {
  type: FeedingType;
  details: string;
  start: string;
  finish: string;
  amount?: number;
  contents?: string;
}

export interface FeedingStopwatch {
  isEdit: boolean;
  details: string;
  startDate: string;
  type: FeedingType;
  isRunning: boolean;
  contents: string;
  amount: number;
};