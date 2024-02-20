import bcrypt from "bcrypt";

export function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
