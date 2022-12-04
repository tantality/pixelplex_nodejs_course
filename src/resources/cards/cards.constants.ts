import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';

const NATIVE_WORD_DTO = new WordDTO({ id: 1, value: 'ef' });
const FOREIGN_WORD_DTO = new WordDTO(new Word(2, 1, 'hello', new Date(), new Date()));
const CARD = new Card(1, 1, 2, new Date(), new Date());
export const CARD_DTO = new CardDTO(CARD, [NATIVE_WORD_DTO], [FOREIGN_WORD_DTO]);
