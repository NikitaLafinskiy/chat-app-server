import { User } from "../../entity";
import { v4 } from "uuid";
import { UserDTO } from "../../dtos/User.dto";
import { hash, compare } from "bcrypt";
import { TokenService } from "../token/TokenService";
import { ApiError } from "../../exceptions/ApiError";
import { IUser } from "../../types/models/IUser";
import { verify } from "jsonwebtoken";
import { client } from "../../config/redis.config";

export class AuthService {
  static async register(
    username: string,
    password: string
  ): Promise<{ refreshUUID: string; accessUUID: string; user: UserDTO }> {
    const checkUser = await User.findOneBy({ username });

    if (checkUser) {
      throw ApiError.UnauthorizedError(`User ${username} already exists`);
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
    const { refreshUUID, accessUUID } = await TokenService.saveRefreshToken(
      refreshToken,
      accessToken
    );

    return { refreshUUID, accessUUID, user: userDTO };
  }

  static async login(
    username: string,
    password: string
  ): Promise<{ refreshUUID: string; accessUUID: string; user: UserDTO }> {
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
    const { refreshUUID, accessUUID } = await TokenService.saveRefreshToken(
      refreshToken,
      accessToken
    );

    return { refreshUUID, accessUUID, user: userDTO };
  }

  static async logout(refreshUUID: string): Promise<{ msg: string }> {
    const { msg } = await TokenService.removeRefreshToken(refreshUUID);

    return { msg };
  }

  static async refresh(
    refreshID: string
  ): Promise<{ accessUUID: string; refreshUUID: string; user: IUser }> {
    const { accessUUID, refreshUUID, user } = await TokenService.updateTokens(
      refreshID
    );
    return { accessUUID, refreshUUID, user };
  }

  static async getUser(accessUUID: string): Promise<{ user: IUser }> {
    const token = await client.get(accessUUID);

    if (!token) {
      throw ApiError.UnauthorizedError("No access token or id present");
    }

    const userPayload = verify(token, process.env.JWT_ACCESS_TOKEN!) as IUser;
    const user = await User.findOneBy({ id: userPayload.id });

    if (!user) {
      throw ApiError.UnauthorizedError("No user with such token");
    }

    const { ...userDTO } = new UserDTO(user);
    return { user: userDTO };
  }
}
