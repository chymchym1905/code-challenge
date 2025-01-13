# List of problems inside the code

## 1. `sortedBalances`

```
const getPriority = (blockchain: any): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100;
        case 'Ethereum':
            return 50;
        case 'Arbitrum':
            return 30;
        case 'Zilliqa':
            return 20;
        case 'Neo':
            return 20;
        default:
            return -99;
    }
};

const sortedBalances = useMemo(() => {
    return balances
        .filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false;
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
}, [balances, prices]);
```

### The code wants to (assumption):

-   filter out the WalletBalance that have priority > -99
-   sort the WalletBalance in order of priority in ascending order

### Problems:

-   `lhsPriority` isn't defined, so i assume it's supposed to be balancePriority
-   sort function doesn't handle the case where priority are equal (assuming priority can be equal)
-   `WalletBalance` object don't have blockchain attribute
-   The filter function will remove all elements of the `balances` collection based on how `getPriority` is implemented.

## 2. `formattedBalances`

```
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
        ...balance,
        formatted: balance.amount.toFixed()
    };
});
```

### The code do:

-   Create an object formattedbalances that include all the fields of object WalletBalance and an additional field `formatted`

### Problem:

-   This code supposed to create an collection of `FormattedWalletBalance` (my assumption)

## 3. `rows`

```
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
        <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
        />
    );
});
```

### The code do:

-   Apply a function that return a React component to elements of type `FormattedWalletBalance` in collection `sortedBalances` (which is incorrect) because the collection sortedBalances contains element of type `WalletBalance`

### Problem:

-   `sortedBalances` should be `formattedBalances` instead
-   `classes.row` but there's no styles defined?
