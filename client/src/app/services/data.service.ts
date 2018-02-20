import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, share } from 'rxjs/operators';
import 'rxjs/add/operator/share';

import { MessageService } from './message.service';

@Injectable()
export class DataService {

  private _clanData: Observable<any>;

  private clanInfoUrl = '/api/clan';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getClanInfo(): Observable<any> {
    if (!this._clanData) {
      this._clanData = this.http.get<any>(this.clanInfoUrl)
        .pipe(
          tap(heroes => this.log(`fetched clanInfo`)),
          catchError(this.handleError('getClanInfo', []))
        )
        .share();
    }
    return this._clanData;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('DataService: ' + message);
  }


}
