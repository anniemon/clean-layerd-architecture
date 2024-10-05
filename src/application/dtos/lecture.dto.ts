import { IsDateString } from 'class-validator';

const allowedProperties = ['date'];
export class LectureDTO {
  @IsDateString()
  date: string;

  constructor(properties: any = {}) {
    Object.keys(properties).forEach((key: string) => {
      if (allowedProperties.includes(key))
        this[key as keyof this] = properties[key];
    });
  }
}
