import { Entity } from '../core/models/_entity';

// All properties are strictly typed and initialized for strict TypeScript.
// No 'readonly' as per user instruction.

export class Post extends Entity {
  title: string = '';
  text: string = '';

  category: string = '';
  tags: string[] = [];
  featured: boolean = false;
  draft: boolean = false;

  photoURL: string = 'https://picsum.photos/1080';
  videoURL: string = '';

  likes: number = 0;
  hearted: boolean = false;

  authorName?: string;
  authorPhotoURL?: string;
  commentsCount?: number;
}
