export class ImageSnippet {
  constructor(public src: string, public file: File) {}

  pending = false;
  status = 'init';
}
