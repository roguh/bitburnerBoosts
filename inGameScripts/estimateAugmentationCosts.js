/** @param {NS} ns */
export async function main(ns) {
	const costStrs = ns.args
	const multipliers = [1.0, 1.9, 3.61, 6.86, 13.03, 24.76, 47.05, 89.39, 169.84, 322.69, 613.11]

	let total = 0
	for (const i in costStrs) {
		const cost = Number(costStrs[i])
		total += cost * multipliers[i]
		ns.tprint(cost, " -> ", cost * multipliers[i])
	}
	ns.tprint("total is $", total)
}
