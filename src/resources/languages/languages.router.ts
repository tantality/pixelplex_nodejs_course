import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { CreateLanguageRequest, DeleteLanguageRequest, GetLanguagesRequest, GetOneLanguageRequest, UpdateLanguageRequest } from './types';
import { LanguagesController } from './languages.controller';
import { LanguagesValidation } from './languages.validation';

const router = Router();

router.get(
  '/',
  checkSchema(LanguagesValidation.getLanguages),
  validatePayload<GetLanguagesRequest>,
  LanguagesController.getLanguages,
);
router.get(
  '/:languageId',
  checkSchema(LanguagesValidation.getOneLanguage),
  validatePayload<GetOneLanguageRequest>,
  LanguagesController.getOneLanguage,
);
router.post(
  '/',
  checkSchema(LanguagesValidation.createLanguage),
  validatePayload<CreateLanguageRequest>,
  LanguagesController.createLanguage,
);
router.patch(
  '/:languageId',
  checkSchema(LanguagesValidation.updateLanguage),
  validatePayload<UpdateLanguageRequest>,
  LanguagesController.updateLanguage,
);
router.delete(
  '/:languageId',
  checkSchema(LanguagesValidation.deleteLanguage),
  validatePayload<DeleteLanguageRequest>,
  LanguagesController.deleteLanguage,
);

export function mountLanguagesRouter(app: Application): void {
  app.use('/api/v1/languages', router);
}
