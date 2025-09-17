import { Entity } from '../core/models/_entity';

// Fixes:
// - All properties should be initialized or marked optional (strict typing).
// - Avoid 'any'; use strict types and inference.
// - Prefer default values for primitives.
// - Use readonly for immutable properties if needed.

export class Post extends Entity {
  title = '';
  text = '';

  category = '';
  tags: string[] = [];
  featured = false;
  draft = false;

  photoURL = 'https://picsum.photos/1080';
  videoURL = '';

  likes = 0;
  hearted = false;
}
