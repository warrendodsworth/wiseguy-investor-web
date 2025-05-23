export class FileData {
  constructor(
    /** can be an http url or a dataURL */
    public url: string,

    /** cloud storage file path - used for deletion */
    public path?: string
  ) {}
}

export class Photo extends FileData {
  constructor(
    /** can be an http url or a dataURL */
    public url: string,

    /** cloud storage file path - used for deletion */
    public path?: string,

    public thumbnailURL?: string,

    public thumbnailPath?: string
  ) {
    super(url, path);
  }
}
