import { AxiosInstance } from "axios";
import type { LoginRequest } from "./request/auth";
import type { AuthResponse } from "./response/auth";
import {MeDto} from "@/api/response/me";

export const login = (client: AxiosInstance, body: LoginRequest) =>
    client.post<AuthResponse>("/auth/login", body);

export const me = (client: AxiosInstance) => client.get<MeDto>("/auth/me");