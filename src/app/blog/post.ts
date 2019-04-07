import { Entity } from '../../models/entity';

export class Post extends Entity {
  id: string;
  title: string;
  text: string;

  category: string;
  tags: string[];
  featured: boolean;
  draft: boolean = false;

  photoURL: string = 'https://loremflickr.com/1080/1080/paris,girl';
  videoURL: string;
  uid: string;
}
