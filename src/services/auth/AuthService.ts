import { RefreshToken, User } from "../../entity";
import { v4 } from "uuid";
import { UserDTO } from "../../dtos/User.dto";
import { hash, compare } from "bcrypt";
import { TokenService } from "../token/TokenService";
import { ApiError } from "../../exceptions/ApiError";
import { IUser } from "../../types/models/IUser";

export class AuthService {
  static async register(
    username: string,
    password: string
  ): Promise<{ refreshToken: string; accessToken: string; user: UserDTO }> {
    const checkUser = await User.findOneBy({ username });
    if (checkUser) {
      throw new Error(`User ${username} already exists`);
    }

    const hashedPassword = await hash(password, 10);

    const activationLink = v4();
    const user = await User.create({
      username,
      password: hashedPassword,
      activationLink,
    }).save();

    const { ...userDTO } = new UserDTO(user);

    const { refreshToken, accessToken } = TokenService.generateTokens(userDTO);
    await TokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { refreshToken, accessToken, user: userDTO };
  }

  static async login(
    username: string,
    password: string
  ): Promise<{ refreshToken: string; accessToken: string; user: UserDTO }> {
    const user = await User.findOneBy({ username });
    if (!user) {
      throw ApiError.BadRequestError("User was not found");
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw ApiError.BadRequestError("Password doesn't match");
    }

    const { ...userDTO } = new UserDTO(user);
    const { refreshToken, accessToken } = TokenService.generateTokens(userDTO);
    await TokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { refreshToken, accessToken, user: userDTO };
  }

  static async logout(token: string): Promise<{ msg: string }> {
    const refreshToken = await RefreshToken.findOneBy({ token });
    if (!refreshToken) {
      throw ApiError.BadRequestError("User is already logged out");
    }
    await refreshToken.remove();

    return { msg: "User logged out" };
  }

  static async refresh(token: string): Promise<{ accessToken: string }> {
    const { accessToken } = await TokenService.updateAccessToken(token);
    return { accessToken };
  }

  static async getUser(token: string): Promise<{ user: IUser }> {
    const { payload } = TokenService.validateAccessToken(token);
    const userPayload = payload as IUser;

    const user = await User.findOneBy({ id: userPayload.id });
    if (!user) {
      throw ApiError.UnauthorizedError("No user with such token");
    }

    const { ...userDTO } = new UserDTO(user);
    return { user: userDTO };
  }
}
