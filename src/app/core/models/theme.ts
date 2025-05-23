export class Theme {
  constructor(public name = 'blue', public dark = false) {}

  get class() {
    return this.name + (this.dark ? '-dark' : '-light');
  }
}
