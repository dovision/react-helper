# `@w2solutions/react-ezauth`

> react authentication helper package

## Usage

```
const reactEzAuth = require('react-ezauth');

// TODO: DEMONSTRATE API
```

## Overriding User Type and Roles

```
// AuthTypes.d.ts

import "@w2solutions/react-ezauth"

declare module "@w2solutions/react-ezauth" {
  export enum UserRole {
    ADMIN = 'Admin',
    USER = 'User',
    DEV = 'Dev'
  }
  
  export interface DefaultUser {
    id: string;
    username: string;
    roles: UserRole[];
    // ...
  }
  
  export declare const useEzAuthUserHasRoles: (roles: UserRole | UserRole[]) => boolean;
  export interface EzAuthRequiredProps {
    fallback?: React.ReactNode;
    roles?: UserRole | UserRole[];
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
  }
}

```
