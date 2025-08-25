import type { Submission } from "./submission";

export type Event = {
    id: string;
    name: string;
    submissions: Submission[];
}