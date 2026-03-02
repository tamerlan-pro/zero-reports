import {
  AbilityBuilder,
  PureAbility,
  AbilityClass,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

// Действия, которые можно выполнять
export enum Action {
  Manage = 'manage', // Все действия
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// Роли пользователей
export enum Role {
  Admin = 'admin', // Полный доступ к лейблу
  Manager = 'manager', // A&R менеджер
  Accountant = 'accountant', // Бухгалтер
  Artist = 'artist', // Артист (только свои данные)
}

// Субъекты (сущности) для проверки прав
// Будут расширяться по мере добавления моделей Prisma
export type Subjects =
  | 'Artist'
  | 'Track'
  | 'Release'
  | 'Analytics'
  | 'User'
  | 'Label'
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

export interface UserContext {
  userId: string;
  tenantId: string;
  role: Role;
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserContext): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(AppAbility);

    switch (user.role) {
      case Role.Admin:
        // Админ лейбла может всё в рамках своего тенанта
        can(Action.Manage, 'all');
        break;

      case Role.Manager:
        // A&R менеджер: управление артистами, треками, релизами
        can(Action.Manage, 'Artist');
        can(Action.Manage, 'Track');
        can(Action.Manage, 'Release');
        can(Action.Read, 'Analytics');
        can(Action.Read, 'User');
        cannot(Action.Delete, 'User');
        break;

      case Role.Accountant:
        // Бухгалтер: чтение всего, управление финансами
        can(Action.Read, 'Artist');
        can(Action.Read, 'Track');
        can(Action.Read, 'Release');
        can(Action.Read, 'Analytics');
        can(Action.Read, 'User');
        break;

      case Role.Artist:
        // Артист: только чтение своих данных
        // Условия будут проверяться на уровне сервисов с учётом userId
        can(Action.Read, 'Artist');
        can(Action.Read, 'Track');
        can(Action.Read, 'Release');
        can(Action.Read, 'Analytics');
        break;

      default:
        // Без прав
        cannot(Action.Manage, 'all');
    }

    return build();
  }
}
