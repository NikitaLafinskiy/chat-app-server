import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { IUser } from "../../types/models/IUser.d";
import { ApiError } from "../../exceptions/ApiError";
import { v4 } from "uuid";
import { client } from "../../config/redis.config";
import { Request, Response } from "express";
import { User } from "../../entity";
import { UserDTO } from "../../dtos/User.dto";
import { createNoSubstitutionTemplateLiteral } from "typescript";

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
    refreshToken: string,
    accessToken: string
  ): Promise<{ refreshUUID: string; accessUUID: string }> {
    const refreshUUID = v4();
    const accessUUID = v4();

    await client.set(refreshUUID, refreshToken);
    await client.set(accessUUID, accessToken);

    return { refreshUUID, accessUUID };
  }

  static async removeRefreshToken(
    refreshUUID: string
  ): Promise<{ msg: string }> {
    await client.del(refreshUUID);

    return { msg: "Logged out successfully" };
  }

  static async updateTokens(
    refreshID: string
  ): Promise<{ accessUUID: string; refreshUUID: string; user: IUser }> {
    const refreshTokenDB = await client.get(refreshID);

    if (!refreshTokenDB) {
      throw ApiError.UnauthorizedError("Session expired please log in again");
    }

    const rtPayload = verify(
      refreshTokenDB,
      process.env.JWT_REFRESH_SECRET as Secret
    ) as IUser;

    const user = await User.findOneBy({ id: rtPayload.id });
    const { ...userDTO } = new UserDTO(user!);

    if (!rtPayload) {
      throw ApiError.UnauthorizedError("Session expired please log in again");
    }

    const { refreshToken, accessToken } = this.generateTokens(userDTO);
    const { refreshUUID, accessUUID } = await this.saveRefreshToken(
      refreshToken,
      accessToken
    );

    return { refreshUUID, accessUUID, user: userDTO };
  }

  static extractTokenFromHeaders(
    req: Request,
    keyword: string
  ): { token: string } {
    const headers = req.headers.authorization;
    if (!headers) {
      throw ApiError.BadRequestError(
        "No authorization headers found on the request"
      );
    }
    const token = headers.split(`${keyword} `)[1].split(",")[0];

    return { token };
  }
}
