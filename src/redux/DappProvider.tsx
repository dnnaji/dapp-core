import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import ProviderInitializer from 'components/ProviderInitializer';
import { NetworkConfigType } from 'types';
import AppInitializer from 'wrappers/AppInitializer';

import SignTransactions from '../components/SignTransactions';
import TransactionSender from '../components/TransactionSender';
import NotificationModal from '../UI/NotificationModal';
import { store, persistor } from './store';
import ToastMessagesList from 'UI/ToastMessagesList';

interface DappProviderPropsType {
  children: React.ReactChildren | React.ReactElement;
  networkConfig: NetworkConfigType;
}

export const DappProvider = ({
  children,
  networkConfig
}: DappProviderPropsType) => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <AppInitializer networkConfig={networkConfig}>
        <ProviderInitializer />
        <SignTransactions />
        <TransactionSender />
        <NotificationModal />
        <ToastMessagesList />
        {children}
      </AppInitializer>
    </PersistGate>
  </Provider>
);
