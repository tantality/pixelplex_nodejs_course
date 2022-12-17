import { CardDTO } from '../card.dto';
import { CardToTransform } from '../types';

export const getCardsAndTheirNumber = (queryResult: [{ cards: CardToTransform[]; count: string }]): { count: number; cards: CardDTO[] } => {
  if (!queryResult.length) {
    return { count: 0, cards: [] };
  }

  const [{ cards, count }] = queryResult;

  const preparedCards = transformCards(cards);

  return { count: Number(count), cards: preparedCards };
};

const transformCards = (cards: CardToTransform[]): CardDTO[] => {
  const transformedCards: CardDTO[] = cards.map((card: CardToTransform) => {
    const { id, nativeLanguageId, foreignLanguageId, nativeWordIds, nativeWordValues, foreignWordIds, foreignWordValues, createdAt } = card;

    const nativeWords = formWords(nativeWordIds, nativeWordValues);
    const foreignWords = formWords(foreignWordIds, foreignWordValues);

    return {
      id,
      nativeLanguageId,
      foreignLanguageId,
      nativeWords,
      foreignWords,
      createdAt,
    } as CardDTO;
  });

  return transformedCards;
};

const formWords = (wordIds: number[], wordValues: string[]): { id: number; value: string }[] => {
  const words = wordIds.map((id, ind) => ({ id, value: wordValues[ind] }));
  return words;
};
