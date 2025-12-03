import React, { useMemo } from 'react';

import { BoxProps } from '@mui/material';

interface WalletBalance {

  currency: string;

  amount: number;

  blockchain: string; // Added missing property

}

interface FormattedWalletBalance extends WalletBalance {

  formatted: string;

}

interface Props extends BoxProps {}

// Moved outside component to avoid recreation

const getPriority = (blockchain: string): number => {

  switch (blockchain) {

    case 'Osmosis':

      return 100;

    case 'Ethereum':

      return 50;

    case 'Arbitrum':

      return 30;

    case 'Zilliqa':

    case 'Neo':

      return 20;

    default:

      return -99;

  }

};

const WalletPage: React.FC<Props> = (props) => {

  const { children, ...rest } = props;

  const balances = useWalletBalances();

  const prices = usePrices();

  const formattedBalances = useMemo(() => {

    // Filter and sort balances

    const filtered = balances.filter((balance: WalletBalance) => {

      const priority = getPriority(balance.blockchain);

      // Keep balances with valid priority AND positive amount

      return priority > -99 && balance.amount > 0;

    });

    const sorted = filtered.sort((lhs: WalletBalance, rhs: WalletBalance) => {

      const leftPriority = getPriority(lhs.blockchain);

      const rightPriority = getPriority(rhs.blockchain);

      // Sort in descending order of priority

      return rightPriority - leftPriority;

    });

    // Format the sorted balances

    return sorted.map((balance: WalletBalance): FormattedWalletBalance => ({

      ...balance,

      formatted: balance.amount.toFixed(2) // Specify decimal places

    }));

  }, [balances]); // Removed prices as it's not used here

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {

    const usdValue = prices[balance.currency] * balance.amount;

    return (

      <WalletRow

        // Use unique identifier instead of index

        key={`${balance.blockchain}-${balance.currency}`}

        amount={balance.amount}

        usdValue={usdValue}

        formattedAmount={balance.formatted}

      />

    );

  });

  return <div {...rest}>{rows}</div>;

};

export default WalletPage;