/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTE GENERATOR - Dynamic Route Creation from Registry
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Generates all application routes programmatically from navRegistry.ts
 * 
 * SINGLE SOURCE OF TRUTH enforcement:
 * - All routes come from ROUTE_REGISTRY
 * - No hardcoded routes allowed
 * - Automatic placeholder pages for unimplemented features
 */

import { Route } from '../components/router';
import { ComingSoon } from '../components/shared/ComingSoon';
import { ROUTE_REGISTRY } from './navRegistry';

/**
 * Generate all routes from the registry
 * 
 * Each route either:
 * 1. Renders its component (if implemented)
 * 2. Shows ComingSoon placeholder (if not implemented)
 */
export function generateRoutes() {
  return ROUTE_REGISTRY.map((routeDef) => {
    const { path, component: Component, placeholder, placeholderTitle, placeholderDescription, placeholderRelatedPath, placeholderRelatedLabel } = routeDef;
    
    // If route has a real component, render it
    if (Component) {
      return (
        <Route key={path} path={path}>
          <Component />
        </Route>
      );
    }
    
    // If route is placeholder, render ComingSoon
    if (placeholder) {
      return (
        <Route key={path} path={path}>
          <ComingSoon
            title={placeholderTitle || 'Coming Soon'}
            description={placeholderDescription || 'This feature is under development.'}
            relatedModulePath={placeholderRelatedPath}
            relatedModuleLabel={placeholderRelatedLabel}
          />
        </Route>
      );
    }
    
    // Fallback (should never happen if registry is properly maintained)
    return (
      <Route key={path} path={path}>
        <ComingSoon
          title="Page Not Found"
          description="This page exists in the navigation but has no component or placeholder defined."
          relatedModulePath="/work/my-work"
          relatedModuleLabel="My Work"
        />
      </Route>
    );
  });
}

/**
 * Quick validation to ensure all routes are properly defined
 * Run in development mode to catch configuration issues
 */
export function validateRouteRegistry() {
  const issues: string[] = [];
  
  ROUTE_REGISTRY.forEach((route) => {
    // Check that each route has either a component or placeholder
    if (!route.component && !route.placeholder) {
      issues.push(`Route "${route.path}" has no component or placeholder defined`);
    }
    
    // Check that placeholders have required metadata
    if (route.placeholder) {
      if (!route.placeholderTitle) {
        issues.push(`Placeholder route "${route.path}" missing placeholderTitle`);
      }
      if (!route.placeholderDescription) {
        issues.push(`Placeholder route "${route.path}" missing placeholderDescription`);
      }
    }
    
    // Check that roles array is not empty
    if (!route.roles || route.roles.length === 0) {
      issues.push(`Route "${route.path}" has no roles assigned`);
    }
  });
  
  if (issues.length > 0 && import.meta.env.DEV) {
    console.warn('⚠️ Route Registry Issues Found:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
  }
  
  return issues;
}
