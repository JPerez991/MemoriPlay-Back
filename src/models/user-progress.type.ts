export interface UserProgress {
    id: number;
    activity_id: number;
    user_id: number;
    total_points: number;
    completed: boolean;
    last_date: string;
}