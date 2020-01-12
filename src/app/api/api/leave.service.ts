/**
 * Evolveum Day Off Planner API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { LeaveRequestAddMessageApiModel } from '../model/leaveRequestAddMessageApiModel';
import { LeaveRequestApiModel } from '../model/leaveRequestApiModel';
import { LeaveRequestCreateApiModel } from '../model/leaveRequestCreateApiModel';
import { LeaveRequestWithApprovalsApiModel } from '../model/leaveRequestWithApprovalsApiModel';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class LeaveService {

    protected basePath = '/';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Add a message to leave request with given ID
     * 
     * @param body Message to be added to leave request
     * @param id Leave request ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addMessage(body: LeaveRequestAddMessageApiModel, id: string, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestWithApprovalsApiModel>;
    public addMessage(body: LeaveRequestAddMessageApiModel, id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestWithApprovalsApiModel>>;
    public addMessage(body: LeaveRequestAddMessageApiModel, id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestWithApprovalsApiModel>>;
    public addMessage(body: LeaveRequestAddMessageApiModel, id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling addMessage.');
        }

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling addMessage.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<LeaveRequestWithApprovalsApiModel>(`${this.basePath}/leave/${encodeURIComponent(String(id))}/message`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Approve/reject leave request with given ID
     * 
     * @param id Leave request ID
     * @param approve Whether to approve (true) or reject (false) leave request
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public approveLeaveRequest(id: string, approve: boolean, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestWithApprovalsApiModel>;
    public approveLeaveRequest(id: string, approve: boolean, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestWithApprovalsApiModel>>;
    public approveLeaveRequest(id: string, approve: boolean, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestWithApprovalsApiModel>>;
    public approveLeaveRequest(id: string, approve: boolean, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling approveLeaveRequest.');
        }

        if (approve === null || approve === undefined) {
            throw new Error('Required parameter approve was null or undefined when calling approveLeaveRequest.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (approve !== undefined && approve !== null) {
            queryParameters = queryParameters.set('approve', <any>approve);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.post<LeaveRequestWithApprovalsApiModel>(`${this.basePath}/leave/${encodeURIComponent(String(id))}/approve`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Cancel leave request with given ID
     * 
     * @param id Leave request ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public cancelLeaveRequest(id: string, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestApiModel>;
    public cancelLeaveRequest(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestApiModel>>;
    public cancelLeaveRequest(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestApiModel>>;
    public cancelLeaveRequest(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling cancelLeaveRequest.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.post<LeaveRequestApiModel>(`${this.basePath}/leave/${encodeURIComponent(String(id))}/cancel`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Create new leave request
     * 
     * @param body Object of leave request to be created
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createLeaveRequest(body: LeaveRequestCreateApiModel, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestApiModel>;
    public createLeaveRequest(body: LeaveRequestCreateApiModel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestApiModel>>;
    public createLeaveRequest(body: LeaveRequestCreateApiModel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestApiModel>>;
    public createLeaveRequest(body: LeaveRequestCreateApiModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createLeaveRequest.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<LeaveRequestApiModel>(`${this.basePath}/leave`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Filter leave requests
     * 
     * @param from From date
     * @param to To date
     * @param status List of statuses to include in result (all if not set)
     * @param users List of users to include in result (all if not set)
     * @param leaveTypes List of leave types to include in result (all if not set)
     * @param approvers List of approvers to include in result (all if not set)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public filterLeaveRequests(from?: string, to?: string, status?: Array<string>, users?: Array<string>, leaveTypes?: Array<string>, approvers?: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<LeaveRequestApiModel>>;
    public filterLeaveRequests(from?: string, to?: string, status?: Array<string>, users?: Array<string>, leaveTypes?: Array<string>, approvers?: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<LeaveRequestApiModel>>>;
    public filterLeaveRequests(from?: string, to?: string, status?: Array<string>, users?: Array<string>, leaveTypes?: Array<string>, approvers?: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<LeaveRequestApiModel>>>;
    public filterLeaveRequests(from?: string, to?: string, status?: Array<string>, users?: Array<string>, leaveTypes?: Array<string>, approvers?: Array<string>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {







        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (from !== undefined && from !== null) {
            queryParameters = queryParameters.set('from', <any>from);
        }
        if (to !== undefined && to !== null) {
            queryParameters = queryParameters.set('to', <any>to);
        }
        if (status) {
            status.forEach((element) => {
                queryParameters = queryParameters.append('status', <any>element);
            })
        }
        if (users) {
            users.forEach((element) => {
                queryParameters = queryParameters.append('users', <any>element);
            })
        }
        if (leaveTypes) {
            leaveTypes.forEach((element) => {
                queryParameters = queryParameters.append('leaveTypes', <any>element);
            })
        }
        if (approvers) {
            approvers.forEach((element) => {
                queryParameters = queryParameters.append('approvers', <any>element);
            })
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<Array<LeaveRequestApiModel>>(`${this.basePath}/leave/filter`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * FORCE approve/reject leave request with given ID (only supervisor)
     * 
     * @param id Leave request ID
     * @param approve Whether to approve (true) or reject (false) leave request
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public forceApproveLeaveRequest(id: string, approve: boolean, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestWithApprovalsApiModel>;
    public forceApproveLeaveRequest(id: string, approve: boolean, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestWithApprovalsApiModel>>;
    public forceApproveLeaveRequest(id: string, approve: boolean, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestWithApprovalsApiModel>>;
    public forceApproveLeaveRequest(id: string, approve: boolean, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling forceApproveLeaveRequest.');
        }

        if (approve === null || approve === undefined) {
            throw new Error('Required parameter approve was null or undefined when calling forceApproveLeaveRequest.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (approve !== undefined && approve !== null) {
            queryParameters = queryParameters.set('approve', <any>approve);
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.post<LeaveRequestWithApprovalsApiModel>(`${this.basePath}/leave/${encodeURIComponent(String(id))}/forceApprove`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get leave request by ID
     * 
     * @param id Leave request ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getLeaveRequestById(id: string, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestApiModel>;
    public getLeaveRequestById(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestApiModel>>;
    public getLeaveRequestById(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestApiModel>>;
    public getLeaveRequestById(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getLeaveRequestById.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<LeaveRequestApiModel>(`${this.basePath}/leave/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get leave request with approvals by ID
     * 
     * @param id Leave request ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getLeaveRequestByIdWithApprovals(id: string, observe?: 'body', reportProgress?: boolean): Observable<LeaveRequestWithApprovalsApiModel>;
    public getLeaveRequestByIdWithApprovals(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LeaveRequestWithApprovalsApiModel>>;
    public getLeaveRequestByIdWithApprovals(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LeaveRequestWithApprovalsApiModel>>;
    public getLeaveRequestByIdWithApprovals(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getLeaveRequestByIdWithApprovals.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<LeaveRequestWithApprovalsApiModel>(`${this.basePath}/leave/${encodeURIComponent(String(id))}/approvals`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
