# @w2solutions/react-ezauth


React authentication helper package.

###  Table of contents

-  [Install](#install)
-  [Usage](#usage)
	-  [EzAuthProvider](#ezauthprovider)
	-  [useEzAuth](#useezauth)
	-  [useEzAuthUserHasRoles](#useezauthuserhasroles-roles-)
	-  [EzAuthRequired](#ezauthrequired)
	-  [ezAuthEventHub](#ezautheventhub)
	-  [Overriding User Type and Roles](#overriding-user-type-and-roles)

# Install

### npm
```npm i @w2solutions/react-ezauth```
### Yarn
```yarn add @w2solutions/react-ezauth```
# Usage
## EzAuthProvider
The `react-ezauth` package creates a context object `EzAuthContext` behind the scenes, its provider `EzAuthProvider` is the key player of the package.
#### EzAuthProviderProps
```javascript
interface EzAuthProviderProps {
	init?: () => Promise<DefaultUser> | DefaultUser
	signIn?: ( username: string, password: string) => 
		(Promise<DefaultUser> | DefaultUser)
	signOut?: () => Promise<void> | void
}
```
>[Click here](#overriding-user-type-and-roles) to see how to override the `DefaultUser` type.
#### `value` prop of `EzAuthProvider`
```javascript
interface EzAuthContextType {
	state: {
		initialized: boolean
		authenticated: boolean
		user: DefaultUser | null
	}
	signIn: ( username: string, password: string) => 
		(Promise<DefaultUser> | DefaultUser)
	signOut: () => Promise<void> | void
}
```
>Functions `signIn` and `signOut` update the state object and emit events that can be used throughout the application.
#### Example
```javascript
import { EzAuthProvider } from "@w2solutions/react-ezauth"

const EzAuth = () => {
	const [user, setUser] = useState(null)

	const init = () => {
		return user
	}

	const signIn = ( username, password ) => {
		const signedInUser = API.signIn()
		setUser(signedInUser)
		return user
	}

	const signOut = () => {
		API.signOut()
	}

	return (
		<EzAuthProvider init={init} signIn={signIn} signOut={signOut}>
			<Page />
		</EzAuthProvider>
)
}
```
## useEzAuth()
`useEzAuth` is a hook that takes the use of the `EzAuthContext` object.
#### Output
[EzAuthContextType](#value-prop-of-ezauthprovider)
#### Example
```javascript
import { useEzAuth } from "@w2solutions/react-ezauth"

const Page = () => {
	const [ state, { signIn, signOut } ] = useEzAuth()

	return (
		<>
			<button onClick={signIn}>Sign In</button>
			<button onClick={signOut}>Sign out</button>
			{state.initialized && <p>Initialized!</p>}
			{state.authenticated && <p>Autheticated!</p>}
			<p>
				User id: {state.user?.id}, 
				username: {state.user?.username}, 
				Roles: {state.user?.roles}
			</p>
		</>
	)
}
```
> The `Page`component should be wrapped by [EzAuthProvider](#ezauthprovider). 
## useEzAuthUserHasRoles( roles )
`useEzAuthUserHasRoles` hook returns a boolean, depending on, if the authenticated user has given role(s).
#### Input
```javascript
roles: DefaultUserRole | DefaultUserRole[]
```
>[Click here](#overriding-user-type-and-roles) to see how to override the `DefaultUserRole` type.
#### Output
```javascript
boolean
```
#### Example
```javascript
import {useEzAuthUserHasRoles} from "@w2solutions/react-ezauth"

const Page = () => {
	const isAdmin = useEzAuthUserHasRoles(DefaultUserRole.ADMIN)

	return (
		<>
			<h1>Admin content:</h1>
			{isAdmin && <p>Attention: Sensitive data</p>}
		</>
	)
}
```
## EzAuthRequired
`EzAuthRequired` component renders children in case the authenticated user has one of the roles provided in the `roles` prop. If not, the `fallback` is rendered.
#### EzAuthRequiredProps
```javascript
interface EzAuthRequiredProps {
	fallback?: React.ReactNode;
	roles?: DefaultUserRole | DefaultUserRole[]
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
}
```
#### Example
```javascript
import { EzAuthRequired } from "@w2solutions/react-ezauth"

const Page = () => {
	return (
		<EzAuthRequired
			roles={DefaultUserRole.ADMIN}
			fallback={<LoginPage />}
		>
			<h1>Welcome to admin page</h1>
		</EzAuthRequired>
	)
}
```
## ezAuthEventHub
`ezAuthEventHub` is an object with a function `subscribe`. One can use the object for interpage communication on the currently authenticated user.
#### Function `subscribe`
```javascript
subscribe: ( {
		type: EzAuthEventType.SIGNED_IN | 
			EzAuthEventType.INITIALIZED | 
			EzAuthEventType.SIGNED_OUT,
		user?: DefaultUser
	} => void ) => {
		unsubscribe: () => void
	}
```
>`subscribe` function accepts a function that acts on the event object. The `subscribe`function then returns an object with an `unsubscribe` function, used to pop the event from the web storage.
#### Example
```javascript
import { ezAuthEventHub } from "@w2solutions/react-ezauth"

const Page = props => {
	useEffect(()=>{
		const subscriber = ezAuthEventHub.subscribe(event=>{
			switch (event.type) {
				case  EzAuthEventType.SIGNED_IN:
					const fetchedData = API.fetchData()
					break;
				case  EzAuthEventType.SIGNED_OUT:
					clearStorage()
					break;
				default:
					console.log('initialized');
					break;
			}
		})
		return () => subscriber.unsubscribe()
	}, [])

	return  (
		<>
			{fetchedData}
		</>
	)
```
> Depending on the type of emitted event we either fetch some user related data or clean the storage. 
## Overriding User Type and Roles
```javascript
// AuthTypes.d.ts

import "@w2solutions/react-ezauth"

declare module "@w2solutions/react-ezauth" {
  export interface DefaultUser {
    id: string;
    username: string;
    roles: DefaultUserRole[];
    // ...
  }

  export enum DefaultUserRole {
    ADMIN = 'Admin',
    DEVELOPER = 'Developer',
    USER = 'User',
  }
}
```