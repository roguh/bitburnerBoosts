from typing import List, Tuple
import itertools

example1 = "1234507"
MAX_IP_BYTE_SIZE = 3

Combination = Tuple[int, int, int]


def str_to_ints(digits_str: str) -> List[int]:
    return [int(c) for c in digits_str]


example1_ints = str_to_ints(example1)


def indices_of_dots(digits: List[int]) -> List[int]:
    indices = []
    for index, (_, next_digit) in enumerate(zip(digits, digits[1:])):
        if next_digit != 0:
            indices.append(index + 1)
    return indices


def digits_to_ip(octets: List[List[int]]) -> str:
    return ".".join("".join(str(digit) for digit in octet) for octet in octets)


def digits_to_int(digits: List[int]) -> int:
    power = 1
    result = 0
    for digit in digits[::-1]:
        result += digit * power
        power *= 10
    return result


def combination_to_ip(digits: List[int], combination: Combination) -> List[List[int]]:
    ip = []
    octet = []
    for index, digit in enumerate(digits):
        octet.append(digit)
        if index + 1 in combination:
            ip.append(octet)
            octet = []
    ip.append(octet)
    return ip


def is_invalid_combination(digits: List[int], combination: Combination) -> bool:
    if len(digits) - combination[-1] > MAX_IP_BYTE_SIZE:
        print(len(digits) - combination[-1], ">")
        return True
    if combination[0] > MAX_IP_BYTE_SIZE:
        print(combination[0], ">")
        return True
    for i in range(1, len(combination)):
        if combination[i] - combination[i - 1] > MAX_IP_BYTE_SIZE:
            return True

    if any(digits_to_int(num) > 255 for num in combination_to_ip(digits, combination)):
        return True
    return False


def digits_to_dot_index_combos(digits) -> List[Combination]:
    return list(itertools.combinations(indices_of_dots(digits), MAX_IP_BYTE_SIZE))


def solve(digits: List[int]) -> List[str]:
    combinations = digits_to_dot_index_combos(digits)
    solutions = []
    non_solutions = []
    for combination in combinations:
        ip = digits_to_ip(combination_to_ip(digits, combination))
        if not is_invalid_combination(digits, combination):
            solutions.append(ip)
        else:
            non_solutions.append(ip)
    return solutions, non_solutions


def main():
    print(solve(str_to_ints("2292505895"))[0])


if __name__ == "__main__":
    main()
