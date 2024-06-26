/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutNestedImport } from './routes/_layout/_nested'
import { Route as LayoutNestedSyncIndexImport } from './routes/_layout/_nested/sync/index'
import { Route as LayoutNestedOverviewIndexImport } from './routes/_layout/_nested/overview/index'

// Create Virtual Routes

const LayoutIndexLazyImport = createFileRoute('/_layout/')()

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexLazyRoute = LayoutIndexLazyImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./routes/_layout/index.lazy').then((d) => d.Route))

const LayoutNestedRoute = LayoutNestedImport.update({
  id: '/_nested',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutNestedSyncIndexRoute = LayoutNestedSyncIndexImport.update({
  path: '/sync/',
  getParentRoute: () => LayoutNestedRoute,
} as any)

const LayoutNestedOverviewIndexRoute = LayoutNestedOverviewIndexImport.update({
  path: '/overview/',
  getParentRoute: () => LayoutNestedRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_nested': {
      preLoaderRoute: typeof LayoutNestedImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      preLoaderRoute: typeof LayoutIndexLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/_nested/overview/': {
      preLoaderRoute: typeof LayoutNestedOverviewIndexImport
      parentRoute: typeof LayoutNestedImport
    }
    '/_layout/_nested/sync/': {
      preLoaderRoute: typeof LayoutNestedSyncIndexImport
      parentRoute: typeof LayoutNestedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  LayoutRoute.addChildren([
    LayoutNestedRoute.addChildren([
      LayoutNestedOverviewIndexRoute,
      LayoutNestedSyncIndexRoute,
    ]),
    LayoutIndexLazyRoute,
  ]),
])

/* prettier-ignore-end */
