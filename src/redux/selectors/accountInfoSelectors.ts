import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

export const accountInfoSelector = (state: RootState) => state.account;

export const addressSelector = createDeepEqualSelector(
  accountInfoSelector,
  (state) => state.address
);

export const accountSelector = createDeepEqualSelector(
  accountInfoSelector,
  (state) => state.account
);

export const accountBalanceSelector = createDeepEqualSelector(
  accountSelector,
  (account) => account.balance
);

export const accountNonceSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state?.nonce?.valueOf() || 0
);

export const shardSelector = createDeepEqualSelector(
  accountInfoSelector,
  (state) => state.shard
);

export const ledgerAccountSelector = createDeepEqualSelector(
  accountInfoSelector,
  (state) => state.ledgerAccount
);

export const walletConnectAccountSelector = createDeepEqualSelector(
  accountInfoSelector,
  (state) => state.walletConnectAccount
);
