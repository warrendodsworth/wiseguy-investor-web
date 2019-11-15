import { Entity } from '../shared/models/entity';

export class Post extends Entity {
  id: string;
  title: string;
  text = '';

  category: string;
  tags: string[];
  featured: boolean;
  draft = false;

  photoURL = 'https://loremflickr.com/1080/1080/paris,girl';
  videoURL: string;
  uid: string;
}
