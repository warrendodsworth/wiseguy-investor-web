// import { PageEvent } from '@angular/material/paginator';

export class GetRequest  { //extends PageEvent
  pageIndex = 0;
  pageSize = 20;
  term: string;

  fields: Field[];
}

export class GetResponse<T> {
  items: T[];
  total: number;
}

export class Field {
  constructor(public name: string, public value: string) {}
}
