import { Pipe, PipeTransform } from '@angular/core';

/**
 * Add html tags
 */
@Pipe({ name: 'addLinks' })
export class AddHtmlLinksPipe implements PipeTransform {
  transform(msg: string): string {
    if (!msg) return '';
    if (typeof msg != 'string') return '';

    const expression =
      /((http(s)?):\/\/)?([a-zA-Z0-9@:%_\+~#=]{2,256}\.)?[a-zA-Z0-9@:%_\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+~.#?&//=]*)/gi;

    return msg.replace(expression, url => {
      let link = url;
      if (!url.startsWith('http')) {
        link = 'https://' + link;
      }
      return `<a class="urlTag" target="_blank" href='${link}'>${url}</a>`;
    });
  }
}
