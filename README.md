
#  dapp-core

> A library that holds the core functional logic of a dapp on the Elrond Network

[![NPM](https://img.shields.io/npm/v/dapp-core.svg)](https://www.npmjs.com/package/@elrondnetwork/dapp-core) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Installation

The library can be installed via npm or yarn.
```bash
npm install @elrondnetwork/dapp-core
```
or
```bash
yarn add @elrondnetwork/dapp-core
```

If you need only the dapp-core basic logic, without the additional UI, consider using the `--no-optional` flag.
This will not install the packages needed for the optional UI components.

```bash
npm install @elrondnetwork/dapp-core --no-optional
```
or
```bash
yarn add @elrondnetwork/dapp-core --no-optional
```


# Usage

dapp-core aims to abstract and simplify the process of interacting with users' wallets and with the Elrond Network, allowing developers to easily get started with a new application or integrate dapp-core into an existing application.

This library covers two main areas: **User Identity** and **Transactions**. The API for interacting with library's logic is exposed via hooks and methods that can be called for logging in the user, getting the status of the user or sending transactions.

However, to simplify usage even further, the library also comes with a default UI that already uses these hooks and methods under the hood. These UI elements can be easily customized with custom css classes.

The default UI is exposed via the `DappUI` object.

`import { DappUI } from "@elrondnetwork/dapp-core";`

More on this below.


## Prerequisites
There are a couple of requirements that need to be met for the application to work properly.

<details>
  <summary>
      React
  </summary>

### React

This library was built for applications that use React, it might not be suitable for usage with other libraries or frameworks.
  </details>

<details>
  <summary>
    DappProvider
 </summary>

### DappProvider
You need to wrap your application with the **DappProvider** component, which is exported by the library, as we need to create a global Context to be able to manipulate the data.
- import the Provider:

`import { DappProvider } from "@elrondnetwork/dapp-core";`

- Wrap your application with this Provider.

`<DappProvider networkConfig={{ network, walletConnectBridge, walletConnectDeepLink }}>`

As you might have noticed, the DappProvider accepts a `networkConfig` object with a couple of keys. This allows using different APIs and different connection providers.

- **walletConnectBridge (optional)** is a string that is used to establish the connection to walletConnect library.
- **walletConnectDeepLink (optional)** is a string that will create a deeplink for an application that is used on a mobile phone, instead of generating the login QR code.
- **network** is a required configuration file that contains the following information about the environment of the application:

```
{
  id: string;
  egldLabel: string;
  name: string;
  walletAddress: string;
  apiAddress: string;
  gatewayAddress: string;
  explorerAddress: string;
}
```
  </details>



<details>
  <summary>
    UI Wrappers
 </summary>

### UI Wrappers

The library exposes a couple of Components that are connected to the redux store and are used to display various elements
when something happens inside the app:

- `TransactionsToastList` will display new transactions in nice toasts at the bottom of the screen. This component is fully customizable.
```
  import {DappUI} from "@elrondnetwork/dapp-core";

  <App>
    <DappUI.TransactionsToastList
    toastId?: string,
    title: string,
    shouldRenderDefaultCss?: boolean,
    className?: string
    />
    <Content/>
  </App>

```



- `SignTransactionsModals` will show a modal when a new transaction is submitted, prompting the user to verify and sign it.
```
  import {DappUI} from "@elrondnetwork/dapp-core";

<App>
  <DappUI.SignTransactionsModals />
  <Content/>
</App>
```
`NotificationModal` Will show a modal to the user with various warnings and errors.

```
  import {DappUI} from "@elrondnetwork/dapp-core";

<App>
  <DappUI.NotificationModal />
  <Content/>
</App>

```

- `DappCoreUIWrapper` is a wrapper that needs to be wrapped around the whole tree to namespace the styles inside dapp-core Components.

```
  import {DappCoreUIWrapper} from "@elrondnetwork/dapp-core";

<App>
  <DappCoreUIWrapper>
  <Content/>
  </DappCoreUIWrapper>
</App>
```


This wrapper will wrap your content in an extra div.
If, for some reason, you want to avoid this, you can use `getWrapperClassname` function to get the className and attach it to a "wrapping" element.

</details>



<details>
  <summary>
    UI css import
 </summary>

### UI css import

To properly apply the default styles to Dapp Core Components, you need to import the bundled css into your App's entry point.

```
import ...

import '@elrondnetwork/dapp-core/build/index.css';

export default function App() {
...

```

</details>

## User Identity
Dapp-core makes logging in and persisting user's session easy and hassle-free.



A handy component is AuthenticatedRoutesWrapper, which can be used to protect certain routes and redirect the user to login page if the user is not authenticated.

Import from dapp-core:
```
import { AuthenticatedRoutesWrapper} from "@elrondnetwork/dapp-core";
```

Use with routes:
```
<AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={routeNames.unlock}
        >
          {appContent}
        </AuthenticatedRoutesWrapper>
```

**routes** should be an array with objects with a signature similar to this:

```
{
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
    authenticatedRoute: true,
  }
```

The important parts that makes this component work are the flag **authenticatedRoute: true** and the key **path**, which means that this route should be accessible only to authenticated users.


  <details>
    <summary>
      Login UI
  </summary>

### Login UI
There are a couple of very handy React components that can be used to login the user and protect certain routes if the user is not logged in.

Under the `DappUI` object mentioned above, you can find 4 buttons (one for each provider) which abstract away all the logic of loggin in the user and render the default UI. These buttons can be easily customized with a custom css class.
The exported buttons are:
- DappUI.ExtensionLoginButton
- DappUI.WalletConnectLoginButton
- DappUI.LedgerLoginButton
- DappUI.WebWalletLoginButton

example:
```
<DappUI.ExtensionLoginButton
  callbackRoute="/dashboard"
  buttonClassName="extension-login"
  loginButtonText="Extension login"
/>
```

They can also be used with children

```
<DappUI.ExtensionLoginButton
  callbackRoute="/dashboard"
  buttonClassName="extension-login"
  loginButtonText="Extension login"
>
  <>
    <icon/>
    <p>Login text</p>
  <>
</DappUI.ExtensionLoginButton
```


`WalletConnectLoginButton` and `LedgerLoginButton` will trigger a modal with a QR code and the ledger login UI, respectively.
These are automatically triggered by the buttons.


If, however, you want access to these containers without the buttons,
you can easily import and use them.

```
<DappUI.LedgerLoginContainer
    className={className}
    shouldRenderDefaultCss={shouldRenderDefaultCss}
    callbackRoute={callbackRoute}
    token={token}
  />
```



Also, for a quicker setup, the `DappUI` object exports an `DappUI.UnlockPage` component, which contains all 4 buttons.

Another handly component is DappUI.AuthenticatedRoutesWrapper, which can be used to protect certain routes and redirect the user to login page if the user is not authenticated.

Import from dapp-core:
```
import { AuthenticatedRoutesWrapper} from "@elrondnetwork/dapp-core";
```

Use with routes:
```
<AuthenticatedRoutesWrapper
    routes={routes}
    unlockRoute={routeNames.unlock}
  >
    {appContent}
  </AuthenticatedRoutesWrapper>
```

**routes** should be an array with objects with a signature similar to this:

```
{
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
    authenticatedRoute: true,
  }
```

The important parts that makes this component work are the flag **authenticatedRoute: true** and the key **path**, which means that this route should be accessible only to authenticated users.
</details>

  <details><summary>
Login hooks
  </summary>

### Login hooks
This area covers the login hooks, which expose a trigger function and the login data, ready to be rendered.

These hooks are exposed by the `loginServices` object, which can be imported from dapp-core:

```
import {loginServices} from @elrondnetwork/dapp-core
```

There are 4 available hooks:
- useExtensionLogin
- useWalletConnectLogin
- useLedgerLogin
- useWebWalletLogin

All hooks have the same respose signature:

return type is as follows:
```
const [triggerFunction, genericLoginReturnType, customLoginReturnType] = useLoginHook({
    callbackRoute,
    logoutRoute
  });
```

- **initiateLogin** is a function that needs to be called for the login flow to be initiated;
- **genericLoginReturnType** is an object that is exactly the same for all hooks:

```
{
  error: string,
  isFailed: boolean,
  isLoading: boolean,
  isLoggedIn: boolean
}
```

- **customLoginReturnType** is an object that is custom for each hook and returns specific data for that login:

  - null for useExtensionLogin;

  - null for useWebWalletConnect;

  -  `{ uriDeepLink: string, qrCodeSvg: svgElement }` for useWalletConnectLogin;

  -
```
{
  accounts: string[];
  showAddressList: boolean;
  startIndex: number;
  selectedAddress: SelectedAddress | null;
  onGoToPrevPage: () => void;
  onGoToNextPage: () => void;
  onSelectAddress: (address: SelectedAddress | null) => void;
  onConfirmSelectedAddress: () => void;
}
```
for useLedgerLogin;

</details>

  <details>
<summary>
Reading User State
  </summary>

### Reading User State
Once logged in, the user's session is persisted and can be read and deleted via a couple of handy functions.

For logging out, the library exposes a simple function called **logout**, which can be called to clear the user data.

There are 2 ways of reading the user current state: hooks (to be used inside components and for reacting to changes in the data) and simple functions (for reading data outside of React components or inside handlers).
- hooks: `useGetLoginInfo, useGetAccountInfo, useGetNetworkConfig`;
- functions: `getAccount, getAccountBalance, getAccountShard, getAddress, getIsLoggedIn;`

</details>

## Transactions

The dapp-core library exposes a straight-forward way of sending transactions and tracking their status, with a couple of handy UI components;

<details><summary>
Sending Transactions
  </summary>

### Sending Transactions
The API for sending transactions is a function called **sendTransactions**:

`import { sendTransactions } from "@elrondnetwork/dapp-core";`

It can be used to send a transaction with minimum information:

```
const { sessionId, error } = await sendTransactions({
    transactions: [
        {
          value: '1000000000000000000',
          data: 'ping',
          receiver: contractAddress
        },
      ],
    });
```

It returns a Promise that will be fulfilled with `{error?: string; sessionId: string | null;}`

`sessionId` is the transaction's batch id which can be used to track a transaction's status and react to it.

</details>

<details><summary>
Transaction Signing Flow
  </summary>


### Transaction Signing Flow

Once a transaction has been submitted,
the user will be prompted in his provider (Extension, Maiar etc) to sign the transaction.

We suggest displaying a message on the screen that confirms the transaction that needs to be signed.
You may do this with `useSignTransactions` hook.

```
 const {
    callbackRoute,
    transactions,
    error,
    sessionId,
    onAbort,
    hasTransactions
  } = useSignTransactions();
```

This hook will let you know if there are any transactions and you can programatically abort the signing process.

You can also get the provider via
```
  const { providerType } = useGetAccountProvider();
```
and use that to display an appropriate message to the user.

For ledger, signing a transaction is simple if you're using the `SignTransactionsModal` component.

It is fully customizable and will take care of walking the user through the signing flow.

If, however, you want to implement a different experience, you will have to use the `useSignTransactionsWithLedger` hook.

it accepts the following props:
```
{
  onCancel: () => void;
}
```
and returns an object with the following keys:

```
{
  onSignTransaction: () => void;
  onNext: () => void;
  onPrev: () => void;
  waitingForDevice: boolean;
  onAbort: (e: React.MouseEvent) => void;
  isLastTransaction: boolean;
  currentStep: number;
  signedTransactions?: Record<string, Transaction>;
  currentTransaction: {
      transaction: Transaction;
      transactionTokenInfo: {
          tokenId: string;
          amount: string;
          receiver: string;
          type?: string;
          nonce?: string;
          multiTxData?: string;
      };
      isTokenTransaction: boolean;
      tokenDenomination: number;
      dataField: string;
  };
  }
```

</details>

<details><summary>
Tracking a transaction
  </summary>


### Tracking a transaction
The library exposes a hook called useTrackTransactionStatus under the object `transactionServices`.

```
import {transactionServices} from @elrondnetwork/dapp-core;

const transactionStatus = transactionServices.useTrackTransactionStatus({
  transactionId: sessionId,
  onSuccess,
  onFailed,
  onCancelled
});
```

transactionStatus has the following information about the transaction:
```
{
  isPending,
  isSuccessful,
  isFailed,
  isCancelled,
  errorMessage,
  status,
  transactions
}
```

It's safe to pass in `null` as a sessionId, so if the transaction wasn't yet sent, the hook will just return an empty object.

Also, one can use the hook `useGetPendingTransactions` to get a list of all pending transactions.
</details>


  <details><summary>
Transaction Toasts UI
  </summary>

### Transaction Toasts UI
dapp-core also exposes a toast component for tracking transactions that uses the above mentioned hooks and displays toasts with transactions statuses.

The toasts list is exposed via **DappUI.TransactionsToastList** component and can be used just by rendering it inside the application.

```
<App>
  <Router/>
  <DappUI.TransactionsToastList />
</App>
```

**Important**: This has to be inside the `<DappProvider/>` children.

</details>



## Roadmap

See the [open issues](https://github.com/ElrondNetwork/dapp-core/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Developers

The [Elrond Team](https://elrond.com/team/).

## License
GPL-3.0-or-later




