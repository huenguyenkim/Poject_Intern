import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterUseCase, LoginUseCase, GetMeUseCase } from './AuthUseCases';
import { UserRole } from '../../../common/constants/user-role.enum';

describe('AuthUseCases', () => {
  let registerUseCase: RegisterUseCase;
  let loginUseCase: LoginUseCase;
  let getMeUseCase: GetMeUseCase;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockTokenService = {
    generate: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(() => {
    registerUseCase = new RegisterUseCase(mockUserRepository as any, mockHashingService as any);
    loginUseCase = new LoginUseCase(mockUserRepository as any, mockHashingService as any, mockTokenService as any);
    getMeUseCase = new GetMeUseCase(mockUserRepository as any);
    jest.clearAllMocks();
  });

  describe('RegisterUseCase', () => {
    it('nên đăng ký tài khoản thành công', async () => {
      const data = { fullName: 'Test User', email: 'test@example.com', password: 'password' };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockHashingService.hash.mockResolvedValue('hashed_password');
      mockUserRepository.create.mockResolvedValue({ id: 1, ...data, password: 'hashed_password', role: UserRole.CUSTOMER });

      const result = await registerUseCase.execute(data);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(data.email);
      expect(mockHashingService.hash).toHaveBeenCalledWith(data.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...data,
        password: 'hashed_password',
        role: UserRole.CUSTOMER,
      });
      expect(result.id).toBe(1);
    });

    it('nên báo lỗi nếu email đã tồn tại', async () => {
      const data = { fullName: 'Test User', email: 'test@example.com', password: 'password' };
      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: data.email });

      await expect(registerUseCase.execute(data)).rejects.toThrow(ConflictException);
    });
  });

  describe('LoginUseCase', () => {
    it('nên đăng nhập thành công', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password', role: UserRole.CUSTOMER };
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockHashingService.compare.mockResolvedValue(true);
      mockTokenService.generate.mockReturnValue('fake_token');

      const result = await loginUseCase.execute('test@example.com', 'password');

      expect(mockHashingService.compare).toHaveBeenCalledWith('password', 'hashed_password');
      expect(mockTokenService.generate).toHaveBeenCalled();
      expect(result.accessToken).toBe('fake_token');
      expect(result.user.email).toBe(user.email);
    });

    it('nên báo lỗi nếu sai email hoặc mật khẩu', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(loginUseCase.execute('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('nên báo lỗi nếu sai mật khẩu', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password' };
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockHashingService.compare.mockResolvedValue(false);

      await expect(loginUseCase.execute('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('GetMeUseCase', () => {
    it('nên lấy thông tin người dùng hiện tại', async () => {
      const user = { id: 1, fullName: 'Test User' };
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await getMeUseCase.execute(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('nên báo lỗi nếu không tìm thấy người dùng', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(getMeUseCase.execute(1)).rejects.toThrow(UnauthorizedException);
    });
  });
});
