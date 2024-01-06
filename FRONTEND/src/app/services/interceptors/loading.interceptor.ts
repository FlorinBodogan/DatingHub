import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize, identity } from 'rxjs';
import { LoadingEffectService } from '../effects/loading-effect.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingEffectService: LoadingEffectService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingEffectService.busy();

    return next.handle(request).pipe(
      (environment.production ? identity : delay(1000)),
      finalize(() => {
        this.loadingEffectService.idle();
      })
    )
  }
}
