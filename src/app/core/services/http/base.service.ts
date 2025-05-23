import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OperatorFunction } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { GetRequest, GetResponse } from '../../../../../../web-wiseguyinvestor/src/app/core/models/http.models';

@Injectable({ providedIn: 'root' })
export class BaseService {
  private responseCache = new Map();
  get url() {
    return `${environment.baseUrl}/${this.endpoint}`;
  }

  constructor(public http: HttpClient, @Inject('') public endpoint: string) {}

  create<T>(model: any) {
    return this.http.post<T | any>(this.url, model).pipe(this.handleError());
  }

  retrieveById<T>(id: any) {
    return this.http.get<T>(`${this.url}/${id}`).pipe(this.handleError<T>());
  }

  retrieve<T>(query?: Partial<GetRequest>) {
    let url = `${this.url}/search`;

    query = Object.assign(new GetRequest(), query);
    query.pageIndex = Math.abs(query.pageIndex);
    query.pageSize = Math.abs(query.pageSize);

    query.fields = query.fields.filter((f) => f.value);

    url += '?q=' + encodeURIComponent(JSON.stringify(query));

    return this.http.get<GetResponse<T>>(url).pipe(
      this.handleError<GetResponse<T>>(),
      tap((res) => {
        if (query.term) {
          this.responseCache.set(url, res);
        }
      })
    );
  }

  update<T>(id: any, model: T | any) {
    return this.http.put<T | any>(`${this.url}/${id}`, model).pipe(this.handleError());
  }

  delete(id: any) {
    return this.http.delete(`${this.url}/${id}`).pipe(this.handleError());
  }

  handleError = <T>(): OperatorFunction<any, T> =>
    map((res: any) => {
      if (res && (res.error || res.status < 200 || res.status >= 300)) {
        throw new HttpErrorResponse(res);
      } else {
        return res as T;
      }
    });
}
