
export interface SleepStopwatch {
    isEdit: boolean;
    details: string;
    startDate: string;
    isRunning: boolean;
};


export interface Sleep {
    id: string;
    start: string;
    type: "Sleep";
    finish: string;
    details: string;
};

export interface CreateSleepInput {
    details: string;
    start: string;
    finish: string;
} 
