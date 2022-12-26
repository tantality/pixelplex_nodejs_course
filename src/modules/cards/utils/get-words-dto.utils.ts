import { WordDTO } from '../word.dto';
import { Word } from '../word.entity';

export const getWordsDTO = (words: Word[]): WordDTO[] => words.map((word) => new WordDTO(word));
