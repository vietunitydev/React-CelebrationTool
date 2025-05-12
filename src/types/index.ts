export interface Word {
    original: string;
    type: string;
    meaning: string;
    id: string;
}

export interface Lesson {
    id: string;
    name: string;
    words: Word[];
}

export interface Project {
    id: string;
    name: string;
    lessons: Lesson[];
}

export interface User {
    username: string;
}

export interface GameResult {
    correctWords: Word[];
    incorrectWords: Word[];
    accuracy: number;
}