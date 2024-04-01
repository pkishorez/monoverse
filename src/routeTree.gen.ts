/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const SyncIndexLazyImport = createFileRoute('/sync/')()
const OverviewIndexLazyImport = createFileRoute('/overview/')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const SyncIndexLazyRoute = SyncIndexLazyImport.update({
  path: '/sync/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/sync/index.lazy').then((d) => d.Route))

const OverviewIndexLazyRoute = OverviewIndexLazyImport.update({
  path: '/overview/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/overview/index.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/overview/': {
      preLoaderRoute: typeof OverviewIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/sync/': {
      preLoaderRoute: typeof SyncIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  OverviewIndexLazyRoute,
  SyncIndexLazyRoute,
])

/* prettier-ignore-end */