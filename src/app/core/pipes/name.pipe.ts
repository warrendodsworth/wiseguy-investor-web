import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstName' })
export class FirstNamePipe implements PipeTransform {
  transform(fullName: string) {
    return fullName?.split(' ')[0] || '';
    // .map(n => n[0]);
    // .join('');
  }
}

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(fullName: string) {
    return fullName
      ?.split(' ')
      .map(n => n[0])
      .join('');
  }
}
