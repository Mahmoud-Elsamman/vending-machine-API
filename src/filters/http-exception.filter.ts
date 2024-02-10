import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'sequelize';

@Catch(HttpException, UnauthorizedException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message: any = exception.getResponse();

    response.status(status).json({
      code: status,
      isError: true,
      status: 'Failure',
      message: message,
      data: null,
    });
  }
}

@Catch(ValidationError)
export class ValidationErrorFilter {
  catch(error: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message: any = error.errors[0].message;
    response.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      isError: true,
      status: 'Failure',
      message: message,
      data: null,
    });
  }
}
