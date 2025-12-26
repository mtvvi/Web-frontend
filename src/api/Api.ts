/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface DtoLoginRequest {
  login: string;
  password: string;
}

export interface DtoLoginResponse {
  status?: string;
  message?: string;
  user_id?: number;
  role?: number;
  token?: string;
  login?: string;
  expires_in?: number;
  token_type?: string;
}

export interface DtoRegisterRequest {
  full_name?: string;
  is_moderator?: boolean;
  login: string;
  password: string;
}

export interface DtoUpdateUserRequest {
  full_name?: string;
  password?: string;
}

export interface DtoUserProfileResponse {
  id?: number;
  login?: string;
  role?: string;
}

export interface DtoServiceResponse {
  base_price?: number;
  description?: string;
  id?: number;
  image_url?: string;
  license_type?: string;
  name?: string;
}

export interface DtoServiceListResponse {
  services?: DtoServiceResponse[];
  total?: number;
}

export interface DtoCartResponse {
  licenseCalculationRequest_id?: number;
  service_count?: number;
}

export interface DtoServiceInLicenseCalculationRequestResp {
  base_price?: number;
  description?: string;
  id?: number;
  image_url?: string;
  license_type?: string;
  name?: string;
  subtotal?: number;
  support_level?: number;
}

export interface DtoLicenseCalculationRequestResponse {
  completed_at?: string;
  cores?: number;
  created_at?: string;
  creator?: string;
  formatted_at?: string;
  id?: number;
  moderator?: string;
  period?: number;
  services?: DtoServiceInLicenseCalculationRequestResp[];
  status?: string;
  total_cost?: number;
  users?: number;
  ready_services?: number;
}

export interface DtoLicenseCalculationRequestListResponse {
  licenseCalculationRequests?: DtoLicenseCalculationRequestResponse[];
  total?: number;
}

export interface DtoUpdateLicenseCalculationRequestFieldsRequest {
  core_count?: number;
  period?: number;
  user_count?: number;
}

export interface DtoUpdateLicenseCalculationRequestServiceRequest {
  support_level: number;
}

export interface DtoSuccessResponse {
  data?: any;
  message?: string;
  status?: string;
}

export interface DtoErrorResponse {
  message?: string;
  status?: string;
}

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: QueryParamsType;
  format?: ResponseFormat;
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export type ResponseFormat = "json" | "text" | "blob" | "arraybuffer";

export class HttpClient {
  public instance: AxiosInstance;
  private securityData: any = null;
  private securityWorker?: (securityData: any) => void;

  constructor(axiosConfig?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: axiosConfig?.baseURL || "",
      ...axiosConfig,
    });

    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
        return Promise.reject(error);
      }
    );
  }

  public setSecurityData = (data: any) => {
    this.securityData = data;
  };

  public request = async <T = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const requestParams: AxiosRequestConfig = {
      ...params,
      headers: {
        ...(type && { "Content-Type": type }),
        ...params.headers,
      },
      params: query,
      responseType: format,
      data: body,
      url: path,
    };

    return this.instance.request(requestParams);
  };
}

export class Api extends HttpClient {
  auth = {
    /**
     * @description Аутентификация пользователя с возвратом JWT токена
     */
    loginCreate: (data: DtoLoginRequest) =>
      this.request<DtoLoginResponse>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
      }),

    /**
     * @description Создание нового пользователя в системе
     */
    registerCreate: (data: DtoRegisterRequest) =>
      this.request<{ message?: string }>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
      }),

    /**
     * @description Завершение сеанса пользователя
     */
    logoutCreate: () =>
      this.request<{ message?: string }>({
        path: `/api/auth/logout`,
        method: "POST",
        format: "json",
      }),

    /**
     * @description Возвращает информацию о текущем пользователе
     */
    profileList: () =>
      this.request<DtoUserProfileResponse>({
        path: `/api/auth/profile`,
        method: "GET",
        format: "json",
      }),

    /**
     * @description Обновляет данные профиля пользователя
     */
    profileUpdate: (data: DtoUpdateUserRequest) =>
      this.request<DtoSuccessResponse>({
        path: `/api/auth/profile`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
      }),
  };

  services = {
    /**
     * @description Возвращает список всех услуг с возможностью поиска
     */
    servicesList: (query?: { query?: string; license_type?: string; min_price?: number; max_price?: number }) =>
      this.request<DtoServiceListResponse>({
        path: `/api/services`,
        method: "GET",
        query: query,
        format: "json",
      }),

    /**
     * @description Возвращает детальную информацию об услуге
     */
    servicesDetail: (id: number) =>
      this.request<DtoServiceResponse>({
        path: `/api/services/${id}`,
        method: "GET",
        format: "json",
      }),

    /**
     * @description Добавляет услугу в черновик заявки
     */
    addToLicenseCalculationRequestCreate: (id: number) =>
      this.request<DtoSuccessResponse>({
        path: `/api/services/${id}/add-to-licenseCalculationRequest`,
        method: "POST",
        format: "json",
      }),
  };

  licenseCalculationRequests = {
    /**
     * @description Возвращает количество услуг в черновике заявки
     */
    cartList: () =>
      this.request<DtoCartResponse>({
        path: `/api/licenseCalculationRequests/cart`,
        method: "GET",
        format: "json",
      }),

    /**
     * @description Возвращает список заявок
     */
    licenseCalculationRequestsList: (query?: { status?: string; date_from?: string; date_to?: string }) =>
      this.request<DtoLicenseCalculationRequestListResponse>({
        path: `/api/licenseCalculationRequests`,
        method: "GET",
        query: query,
        format: "json",
      }),

    /**
     * @description Возвращает детальную информацию о заявке
     */
    licenseCalculationRequestsDetail: (id: number) =>
      this.request<DtoLicenseCalculationRequestResponse>({
        path: `/api/licenseCalculationRequests/${id}`,
        method: "GET",
        format: "json",
      }),

    /**
     * @description Обновляет поля заявки
     */
    licenseCalculationRequestsUpdate: (id: number, data: DtoUpdateLicenseCalculationRequestFieldsRequest) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequests/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
      }),

    /**
     * @description Удаляет заявку
     */
    licenseCalculationRequestsDelete: (id: number) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequests/${id}`,
        method: "DELETE",
        format: "json",
      }),

    /**
     * @description Формирует заявку (переводит из черновика в сформирован)
     */
    formatUpdate: (id: number) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequests/${id}/format`,
        method: "PUT",
        format: "json",
      }),

    /**
     * @description Завершает заявку модератором
     */
    completeUpdate: (id: number) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequests/${id}/complete`,
        method: "PUT",
        format: "json",
      }),

    /**
     * @description Отклоняет заявку модератором
     */
    rejectUpdate: (id: number) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequests/${id}/reject`,
        method: "PUT",
        format: "json",
      }),
  };

  licenseCalculationRequestServices = {
    /**
     * @description Удаляет услугу из заявки
     */
    deleteService: (licenseCalculationRequestId: number, serviceId: number) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequest-services/${licenseCalculationRequestId}/${serviceId}`,
        method: "DELETE",
        format: "json",
      }),

    /**
     * @description Изменяет коэффициент поддержки для услуги
     */
    updateService: (licenseCalculationRequestId: number, serviceId: number, data: DtoUpdateLicenseCalculationRequestServiceRequest) =>
      this.request<DtoSuccessResponse>({
        path: `/api/licenseCalculationRequest-services/${licenseCalculationRequestId}/${serviceId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
      }),
  };
}
