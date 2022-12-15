import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { isAuth, validatePayload } from '../../middleware';
import { TasksController } from './tasks.controller';
import { TasksValidation } from './tasks.validation';
import { GetTasksRequest, GetStatisticsRequest, CreateTaskRequest, AddAnswerToTaskRequest } from './types';

const router = Router();

router.get('/', checkSchema(TasksValidation.getTasks), validatePayload<GetTasksRequest>, isAuth<GetTasksRequest>, TasksController.getTasks);
router.get(
  '/statistics',
  checkSchema(TasksValidation.getStatistics),
  validatePayload<GetStatisticsRequest>,
  isAuth<GetStatisticsRequest>,
  TasksController.getStatistics,
);
router.post(
  '/',
  checkSchema(TasksValidation.createTask),
  validatePayload<CreateTaskRequest>,
  isAuth<CreateTaskRequest>,
  TasksController.createTask,
);
router.post(
  '/:taskId/answer',
  checkSchema(TasksValidation.addAnswerToTask),
  validatePayload<AddAnswerToTaskRequest>,
  isAuth<AddAnswerToTaskRequest>,
  TasksController.updateTask,
);

export function mountTasksRouter(app: Application): void {
  app.use('/api/v1/tasks', router);
}
