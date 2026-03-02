import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Декоратор для пометки роутов как публичных (без авторизации)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
