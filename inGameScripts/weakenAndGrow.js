const PROGRAM_NAME = "weakenAndGrow:"

/** @param {NS} ns */
async function plook(ns, target) {
	await ns.weaken(target);
	await ns.grow(target);
	// TODO print runtime
	console.log(PROGRAM_NAME, "weakened and growed", target)
}

/** @param {NS} ns */
export async function main(ns) {
	let hosts = ns.args
	while (true) {
		for (const host of hosts) {			
			await plook(ns, host)
		}
	}
}
