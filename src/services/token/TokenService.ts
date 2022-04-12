import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { IUser } from "../../types/models/IUser.d";
import { RefreshToken } from "../../entity";
import { ApiError } from "../../exceptions/ApiError";
import { User } from "../../entity";
import { UserDTO } from "../../dtos/User.dto";

export class TokenService {
  static generateTokens(user: IUser): {
    accessToken: string;
    refreshToken: string;
  } {
    const refreshToken = sign(user, process.env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: "30d",
    });
    const accessToken = sign(user, process.env.JWT_ACCESS_TOKEN as Secret, {
      expiresIn: "5m",
    });

    return { accessToken, refreshToken };
  }

  static async saveRefreshToken(
    userID: number,
    token: string
  ): Promise<{ refreshToken: RefreshToken }> {
    const refreshToken = await RefreshToken.findOneBy({ userID });
    if (refreshToken) {
      throw ApiError.BadRequestError("Refresh token is already stored");
    }
    const newToken = await RefreshToken.create({ token, userID }).save();

    return { refreshToken: newToken };
  }

  static async validateRefreshToken(
    token: string
  ): Promise<{ refreshToken: RefreshToken; isValid: boolean }> {
    const refreshToken = await RefreshToken.findOneBy({ token });
    if (!refreshToken) {
      throw ApiError.UnauthorizedError(
        "Refresh token doesn't exist (user is not registered)"
      );
    }

    const isValidToken = verify(
      token,
      process.env.JWT_REFRESH_SECRET as Secret
    );

    if (!isValidToken) {
      throw ApiError.UnauthorizedError("Refresh token has expired");
    }

    return { isValid: true, refreshToken };
  }

  static validateAccessToken(token: string): {
    isValid: boolean;
    payload: JwtPayload | string;
  } {
    try {
      const payload = verify(token, process.env.JWT_ACCESS_TOKEN as Secret);

      return { payload, isValid: true };
    } catch (err) {
      return { payload: "", isValid: false };
    }
  }

  static async updateAccessToken(
    token: string
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = await this.validateRefreshToken(token);

    const user = await User.findOneBy({ id: refreshToken.userID });
    const { ...userDTO } = new UserDTO(user as User);

    const { accessToken } = this.generateTokens(userDTO);

    return { accessToken };
  }
}
