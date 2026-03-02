import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
}

/**
 * Декоратор для получения текущего пользователя из запроса
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: CurrentUserData) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserData;

    return data ? user?.[data] : user;
  },
);
