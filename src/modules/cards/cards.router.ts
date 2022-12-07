import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { CardsController } from './cards.controller';
import { CardsValidation } from './cards.validation';
import { CreateCardRequest, DeleteCardRequest, GetCardsRequest, UpdateCardRequest } from './types';

const router = Router();

router.get('/', checkSchema(CardsValidation.getCards), validatePayload<GetCardsRequest>, CardsController.getCards);
router.post('/', checkSchema(CardsValidation.createCard), validatePayload<CreateCardRequest>, CardsController.createCard);
router.patch('/:cardId', checkSchema(CardsValidation.updateCard), validatePayload<UpdateCardRequest>, CardsController.updateCard);
router.delete('/:cardId', checkSchema(CardsValidation.deleteCard), validatePayload<DeleteCardRequest>, CardsController.deleteCard);

export function mountCardsRouter(app: Application): void {
  app.use('/api/v1/cards', router);
}
