import { getAuthTokenAsync } from "./auth";
import { reportToParentWindow } from "./internal/creao-shell";

const API_BASE_PATH = import.meta.env.VITE_MCP_API_BASE_PATH;

export class PlatformRequestError extends Error {
        status: number;

        url: string;

        data: unknown;

        headers: Record<string, string>;

        constructor(message: string, options: {
                status: number;
                url: string;
                data: unknown;
                headers: Record<string, string>;
        }) {
                super(message);
                this.name = "PlatformRequestError";
                this.status = options.status;
                this.url = options.url;
                this.data = options.data;
                this.headers = options.headers;
        }
}

async function parseResponseBody(response: Response): Promise<unknown> {
        const contentType = response.headers.get("content-type") || "";

        try {
                if (contentType.includes("application/json")) {
                        return await response.json();
                }

                return await response.text();
        } catch (error) {
                return `Failed to parse response body: ${error instanceof Error ? error.message : String(error)}`;
        }
}

/**
 * a simple wrapper for `fetch` with authentication token and error handling
 */
export async function platformRequest(
	url: string | URL | Request,
	options: RequestInit = {},
): Promise<Response> {
	const token = await getAuthTokenAsync();
	const method = options.method || "GET";

	const headers = new Headers(options.headers);
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	if (typeof url === 'object' && url && 'headers' in url) {
		url.headers?.forEach?.((value, key) => {
			headers.set(key, value);
		});
	}
	if (!headers.has("Content-Type") && method !== "GET") {
		headers.set("Content-Type", "application/json");
	}

        const realUrl = typeof url === "string" ? new URL(url, API_BASE_PATH) : url;
        const response = await fetch(realUrl, {
                ...options,
                headers,
        });

        const responseClone = response.clone();
        const responseHeaders = Object.fromEntries(response.headers.entries());

        if (!response.ok) {
                const parsedBody = await parseResponseBody(responseClone);
                reportToParentWindow({
                        type: "platform-request",
                        timestamp: new Date().toISOString(),
                        url: response.url,
                        method,
                        status: response.status,
                        responseHeaders,
                        error: parsedBody,
                });

                throw new PlatformRequestError(
                        `Platform request failed with status ${response.status}`,
                        {
                                status: response.status,
                                url: response.url,
                                data: parsedBody,
                                headers: responseHeaders,
                        },
                );
        }

        reportToParentWindow({
                type: "platform-request",
                timestamp: new Date().toISOString(),
                url: response.url,
                method,
                status: response.status,
                responseHeaders,
        })

        return response;
}

/**
 * simpler wrapper for `platformRequest` with common methods
 *
 * eg: `platformApi.get("/api/users").then(r=>r.json())`
 */
export const platformApi = {
	get: async (url: string, options?: RequestInit) => {
		return platformRequest(url, { ...options, method: "GET" });
	},

	post: async (url: string, data?: unknown, options?: RequestInit) => {
		return platformRequest(url, {
			...options,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	put: async (url: string, data?: unknown, options?: RequestInit) => {
		return platformRequest(url, {
			...options,
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	delete: async (url: string, options?: RequestInit) => {
		return platformRequest(url, { ...options, method: "DELETE" });
	},
};
