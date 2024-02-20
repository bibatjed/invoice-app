import jwt from "jsonwebtoken";
import ErrorService from "../utils/ErrorService";
const secret = process.env.SECRET as string;

export type JWT = { id: number } & jwt.JwtPayload;
export async function generateJwt(data: { id: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        ...data,
      },
      secret,
      { expiresIn: 60 * 60 },
      (err, jwt) => {
        if (err) {
          reject(err);
        }

        resolve(jwt as string);
      }
    );
  });
}

export async function generateRefreshToken(data: { id: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        ...data,
      },
      secret,
      { expiresIn: 24 * 60 * 60 },
      (err, jwt) => {
        if (err) {
          reject(err);
        }

        resolve(jwt as string);
      }
    );
  });
}

export async function verifyJwt(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err instanceof jwt.TokenExpiredError) {
        reject(new ErrorService(401, "Token expired."));
      }

      if (err instanceof jwt.JsonWebTokenError) {
        reject(new ErrorService(401, "Invalid Token."));
      }
      resolve(decoded);
    });
  });
}
