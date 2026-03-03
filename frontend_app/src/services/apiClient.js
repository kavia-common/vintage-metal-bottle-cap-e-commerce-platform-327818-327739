import { getAppEnv } from '../config/env';
import { createLogger } from '../lib/logger';

const log = createLogger('ApiClient');

/**
 * API client contract:
 * Inputs:
 * - request: { method, path, query?, body?, headers?, signal? }
 * - options: { useMockFallback?: boolean, getAuthToken?: () => (string|undefined|null) }
 * Outputs:
 * - Resolves to parsed JSON (when response has JSON) or null for 204.
 * Errors:
 * - Throws ApiError with { status, code, message, details } when network/HTTP failure.
 * Side effects:
 * - Network call (or mock adapter call).
 */

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildUrl(baseUrl, path, query) {
  const url = new URL(path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new ApiError('Invalid JSON received from server', {
      status: res.status,
      code: 'INVALID_JSON',
      details: { textPreview: text.slice(0, 500) }
    });
  }
}

// PUBLIC_INTERFACE
export function createApiClient(options = {}) {
  /** This is a public function. */
  const env = getAppEnv();
  const baseUrl = env.apiBaseUrl || env.backendUrl || '';
  const useMockFallback = options.useMockFallback !== false; // default true

  const mockAdapterPromise = lazyMockAdapter();

  return {
    request: async (req) => {
      const op = `${req.method || 'GET'} ${req.path}`;
      const startedAt = Date.now();

      if (!baseUrl) {
        if (!useMockFallback) {
          throw new ApiError('API base URL not configured (REACT_APP_API_BASE/REACT_APP_BACKEND_URL)', {
            status: 0,
            code: 'NO_API_BASE'
          });
        }
        log.warn('No API base configured; using mock adapter', { op });
        const adapter = await mockAdapterPromise;
        return adapter.handle(req);
      }

      try {
        const url = buildUrl(baseUrl, req.path, req.query);
        const headers = {
          'Content-Type': 'application/json',
          ...(req.headers || {})
        };

        const token = options.getAuthToken ? options.getAuthToken() : null;
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, {
          method: req.method || 'GET',
          headers,
          body: req.body === undefined ? undefined : JSON.stringify(req.body),
          signal: req.signal
        });

        if (!res.ok) {
          let details = null;
          try {
            details = await parseJsonSafe(res);
          } catch (e) {
            // ignore JSON parse error for non-JSON errors
          }
          throw new ApiError(`HTTP ${res.status} for ${op}`, {
            status: res.status,
            code: 'HTTP_ERROR',
            details
          });
        }

        const data = await parseJsonSafe(res);
        log.debug('request ok', { op, ms: Date.now() - startedAt });
        return data;
      } catch (err) {
        const isApiError = err instanceof ApiError;
        log.error('request failed', {
          op,
          ms: Date.now() - startedAt,
          error: isApiError ? { name: err.name, status: err.status, code: err.code, message: err.message } : { message: String(err) }
        });

        if (useMockFallback) {
          log.warn('Falling back to mock adapter', { op });
          const adapter = await mockAdapterPromise;
          return adapter.handle(req);
        }
        throw err;
      }
    }
  };
}

async function lazyMockAdapter() {
  // Dynamic import keeps mock code isolated and allows future removal when backend exists.
  const mod = await import('./mock/mockAdapter');
  return mod.mockAdapter;
}
