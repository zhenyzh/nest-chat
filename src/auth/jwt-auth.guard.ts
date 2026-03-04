import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    }

    try {
      req.user = this.jwtService.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    }
  }
}
