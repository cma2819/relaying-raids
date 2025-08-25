import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('./layout.tsx', [
    index('./routes/home.tsx'),
    route('login', './routes/login.tsx'),
    ... prefix('events', [
      route("-/new", "./routes/events/new.tsx")
    ])
  ]),
  route('auth/callback', './routes/callback.tsx'),
  route('logout', './routes/logout.tsx'),
] satisfies RouteConfig;
