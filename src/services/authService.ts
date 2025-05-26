import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import {IUser} from '../interfaces/IUser'
import dotenv from 'dotenv';
import { Document } from 'mongoose';
import ms from 'ms';

dotenv.config();

interface JwtPayload {
  userId: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}

export class AuthService {
  static async register(username: string, email: string, password: string): Promise<IUser & Document> {
    try {
      const user = new User({ username, email, password });
      await user.save();
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Username or email already exists');
      }
      throw new Error('Registration failed');
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Verificación estricta del secret
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret || typeof jwtSecret !== 'string') {
            throw new Error('JWT secret not configured');
        }

        // Convertir userId de manera segura
        const userId = user._id?.toString ? user._id.toString() : String(user._id);

        // Configurar tiempo de expiración
        const expiresInString = process.env.JWT_EXPIRES_IN || '1h';

        // Generar token
        const token = jwt.sign(
          { userId },
          jwtSecret,
          { expiresIn: expiresInString } as jwt.SignOptions
        );


        return {
            user: {
            id: userId,
            username: user.username,
            email: user.email
            },
            token
        };
    }

  static async verifyToken(token: string): Promise<JwtPayload> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || typeof jwtSecret !== 'string') {
      throw new Error('JWT secret not configured');
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          reject(new Error('Invalid token'));
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }
}