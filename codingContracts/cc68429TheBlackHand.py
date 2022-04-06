"""
You are attempting to solve a Coding Contract. You have 9 tries remaining, after which the contract will self-destruct.

You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

52,22,112,125,121,195,6,20,188,49

Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0
"""
from typing import List


def solve(prices: List[int]) -> int:
    max_profit = -(2 << 32)
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            profit1 = prices[j] - prices[i]
            for i2 in range(j, len(prices)):
                for j2 in range(i2 + 1, len(prices)):
                    profit2 = prices[j2] - prices[i2]
                    max_profit = max(profit2 + profit1, max_profit)
    return max(max_profit, 0)


def main():
    print(solve([52, 22, 112, 125, 121, 195, 6, 20, 188, 49]))


if __name__ == "__main__":
    main()
