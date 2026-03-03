/**
 * Contract: normalized access to REACT_APP_* variables for the frontend.
 *
 * Inputs:
 * - process.env.REACT_APP_* provided by CRA build/runtime.
 *
 * Outputs:
 * - getAppEnv(): returns a frozen object with typed-ish fields:
 *   { apiBaseUrl, backendUrl, frontendUrl, wsUrl, nodeEnv, logLevel, featureFlags, experimentsEnabled }
 *
 * Errors:
 * - Never throws. Missing vars are returned as empty strings / defaults; callers decide behavior.
 *
 * Side effects:
 * - None (pure read of process.env).
 */

// PUBLIC_INTERFACE
export function getAppEnv() {
  /** This is a public function. */
  const apiBaseUrl = (process.env.REACT_APP_API_BASE || '').trim();
  const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').trim();
  const frontendUrl = (process.env.REACT_APP_FRONTEND_URL || '').trim();
  const wsUrl = (process.env.REACT_APP_WS_URL || '').trim();

  const nodeEnv = (process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development').trim();
  const logLevel = (process.env.REACT_APP_LOG_LEVEL || 'info').trim();

  const featureFlagsRaw = (process.env.REACT_APP_FEATURE_FLAGS || '').trim();
  const experimentsEnabled = (process.env.REACT_APP_EXPERIMENTS_ENABLED || 'false').trim().toLowerCase() === 'true';

  const featureFlags = parseCommaFlags(featureFlagsRaw);

  return Object.freeze({
    apiBaseUrl,
    backendUrl,
    frontendUrl,
    wsUrl,
    nodeEnv,
    logLevel,
    featureFlags,
    experimentsEnabled
  });
}

function parseCommaFlags(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}
