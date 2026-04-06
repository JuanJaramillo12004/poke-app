import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Guard: protects routes by enforcing authentication requirements.
export class JwtAuthGuard extends AuthGuard('jwt') {}
