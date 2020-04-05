export class PhotoFile {
  constructor(public dataUrl: string, public file: File) {}

  // pending = false;
  // status = 'init';
}

export class Photo {
  constructor(public downloadUrl: string, public storagePath: string) {}
}
