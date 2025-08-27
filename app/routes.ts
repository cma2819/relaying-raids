import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('./layouts/app.tsx', [
    layout('./layouts/without-navigation.tsx', [
      index('./routes/home.tsx'),
      route('login', './routes/login.tsx'),
      ...prefix('events', [
        route(':slug/live', './routes/events/$slug.live.tsx'),
      ]),
    ]),
    layout('./layouts/with-navigation.tsx', [
      route('participate', './routes/participate.tsx'),
      ...prefix('participate', [
        route(':slug', './routes/participate/$slug.tsx'),
        route(':slug/skip', './routes/participate/$slug.skip.tsx'),
      ]),
      ...prefix('events', [
        index('./routes/events/index.tsx'),
        route('-/new', './routes/events/new.tsx'),
        route(':slug', './routes/events/edit.tsx'),
        route(':slug/progress', './routes/events/$slug.progress.tsx'),
      ]),
    ]),
  ]),
  route('auth/callback', './routes/callback.tsx'),
  route('logout', './routes/logout.tsx'),
] satisfies RouteConfig;
