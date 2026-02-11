import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('getMe returns user from session', () => {
    const mockSession = {
      session: { id: 'sess-1', userId: 'user-1', expiresAt: new Date() },
      user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
    };

    const result = controller.getMe(mockSession as any);
    expect(result).toEqual({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
    });
  });
});
