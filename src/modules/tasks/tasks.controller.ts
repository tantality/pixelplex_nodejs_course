import { NextFunction } from 'express';
import { TasksService } from './tasks.service';
import {
  GetTasksRequest,
  GetTasksResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  AddAnswerToTaskRequest,
  AddAnswerToTaskResponse,
  GetStatisticsCommon,
} from './types';

export class TasksController {
  static getTasks = async (req: GetTasksRequest, res: GetTasksResponse, next: NextFunction): Promise<void> => {
    try {
      const tasks = await TasksService.findAndCountAll(req.userId as number, req.query);
      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  static getStatistics = async (req: GetStatisticsRequest, res: GetStatisticsResponse, next: NextFunction): Promise<void> => {
    try {
      const statistics = await TasksService.calculateStatistics(req);
      res.status(200).json({ statistics: statistics as GetStatisticsCommon });
    } catch (err) {
      next(err);
    }
  };

  static createTask = async (req: CreateTaskRequest, res: CreateTaskResponse, next: NextFunction): Promise<void> => {
    try {
      const createdTask = await TasksService.create(req.userId as number, req.body);
      res.status(201).json(createdTask);
    } catch (err) {
      next(err);
    }
  };

  static updateTask = async (req: AddAnswerToTaskRequest, res: AddAnswerToTaskResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedTask = await TasksService.update(req.userId as number, req.params.taskId, req.body);
      res.status(201).json(updatedTask);
    } catch (err) {
      next(err);
    }
  };
}
