import { Entity } from '../core/models/_entity';

export class Post extends Entity {
  id: string;
  title: string;
  text = '';

  category: string;
  tags: string[];
  featured: boolean;
  draft = false;

  photoURL = 'https://picsum.photos/1080';
  videoURL: string;
  uid: string;

  likes: number;
  hearted: boolean;
}
