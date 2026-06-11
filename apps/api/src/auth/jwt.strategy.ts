import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

const COGNITO_REGION = 'eu-north-1';
const COGNITO_POOL_ID = 'eu-north-1_EO3mZjvlY';
const COGNITO_ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_POOL_ID}`;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${COGNITO_ISSUER}/.well-known/jwks.json`,
      }),
      issuer: COGNITO_ISSUER,
      algorithms: ['RS256'],
      audience: 'fa20c4t3ctkiivkp8tea9p4vj',
    });
  }

  validate(payload: any) {
    const obj = {
      userId: payload.sub as string,
      email: payload.email as string,
    };
    return obj;
  }
}
