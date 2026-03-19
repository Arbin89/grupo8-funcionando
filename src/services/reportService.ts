import { apiRequest } from "./api";

export type Report = {
    id: number;
    name: string;
    email: string;
    type: string;
    description: string;
    status: "pendiente" | "revisado" | "resuelto";
    created_at: string;
};

export type ReportPayload = {
    name: string;
    email: string;
    type: string;
    description: string;
    status?: string;
};

// Público – no requiere token
export const createReport = async (data: ReportPayload): Promise<Report> => {
    const res = await apiRequest("/reports", { method: "POST", body: JSON.stringify(data) });
    return res.report;
};

// Solo admin
export const getReports = async (): Promise<Report[]> => {
    return await apiRequest("/reports");
};

export const updateReport = async (id: number, data: Partial<ReportPayload>): Promise<Report> => {
    const res = await apiRequest(`/reports/${id}`, { method: "PUT", body: JSON.stringify(data) });
    return res.report;
};

export const deleteReport = async (id: number): Promise<void> => {
    await apiRequest(`/reports/${id}`, { method: "DELETE" });
};
