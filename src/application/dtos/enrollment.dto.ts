import { IsString } from 'class-validator';

const allowedProperties = ['userId', 'lectureId'];

export class EnrollmentDTO {
  // todo: get userId from jwt
  @IsString()
  userId: string;

  @IsString()
  lectureId: string;

  constructor(properties: any = {}) {
    Object.keys(properties).forEach((key: string) => {
      if (allowedProperties.includes(key))
        this[key as keyof this] = properties[key];
    });
  }
}
