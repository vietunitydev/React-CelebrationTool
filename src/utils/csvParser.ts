import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Word } from '../types';

export const parseCSV = (file: File): Promise<Word[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                try {
                    const words: Word[] = results.data
                        .filter((row: any) => row.length >= 3 && row[0] && row[2])
                        .map((row: any) => ({
                            original: row[0].trim(),
                            type: row[1]?.trim() || '',
                            meaning: row[2].trim(),
                            id: uuidv4()
                        }));
                    resolve(words);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
