import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { PaginatedResult } from "src/app/interfaces/pagination";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient): Observable<PaginatedResult<T>> {
    return http.get<T>(url, { observe: 'response', params }).pipe(
        map(response => {
            const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

            if (response.body) {
                paginatedResult.result = response.body;
            }

            const pagination = response.headers.get('Pagination');
            if (pagination) {
                const paginationObj = JSON.parse(pagination);
                paginatedResult.pagination = paginationObj;
                paginatedResult.totalLength = paginationObj.totalItems;
            }

            return paginatedResult;
        })
    );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
};