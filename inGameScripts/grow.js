const PROGRAM_NAME = "weaken:"

/** @param {NS} ns */
async function plook(ns, target) {
	await ns.grow(target);
	//console.log(PROGRAM_NAME, "growed", target)
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
