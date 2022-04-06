# contract-472934-KuaiGongInternational.cct

# WRONG ANSWER BECAUSE YOU SOLVED THE WRONG PROBLEM
import math
import itertools
from typing import List, Tuple

IP_BYTE_COUNT = 4
MAX_IP_BYTE_SIZE = 3

Dimension = Tuple[int, int, int, int]


IP_DIMENSIONS: List[Dimension] = list(
    itertools.product(*[list(range(1, MAX_IP_BYTE_SIZE + 1))] * IP_BYTE_COUNT)
)


def permutations(population: int, length: int) -> int:
    return math.perm(population, length)


def invalid_ip_count(population: int, dimension: Dimension, zeros: int) -> int:
    invalid_sizes = []
    for byte_size in dimension:
        if zeros == 1 and byte_size > 1:
            invalid_sizes.append(permutations(population - 1, sum(dimension) - 1))
    return sum(invalid_sizes)


def count_zeros(population: List[int]) -> int:
    return sum(element == 0 for element in population)


def number_of_ips(population: List[int]) -> int:
    zeros = count_zeros(population)
    if zeros > 1:
        raise NotImplementedError(
            "Not sure how to count when there is more than 1 zero"
        )

    ip_sizes = {}
    for dimension in IP_DIMENSIONS:
        if sum(dimension) > len(population):
            continue
        dim_permutations = permutations(len(population), sum(dimension))
        dim_invalid_ip_count = invalid_ip_count(len(population), dimension, zeros)
        ip_sizes[dimension] = dim_permutations - dim_invalid_ip_count

    return sum(ip_sizes.values()), ip_sizes


def main():
    print(number_of_ips([int(c) for c in "2292505895"]))


if __name__ == "__main__":
    main()
