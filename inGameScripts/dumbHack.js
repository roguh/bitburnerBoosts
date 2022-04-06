const PROGRAM_NAME = "dumbHack:"
const BROKE_ASS_MOTHERFUCKER = 5000

/** @param {NS} ns */
async function plook(ns, target) {
	if (ns.getServerMoneyAvailable(target) > BROKE_ASS_MOTHERFUCKER) {
		const start = new Date()
		const value = await ns.hack(target)
		const duration = ((new Date()) - start) / 1000
		//console.log(PROGRAM_NAME, "hacked", target, "for", value, "after", Math.round(duration / 60), "minutes", duration % 60, "seconds")
	}
}

/** @param {NS} ns */
export async function main(ns) {
	let hosts = ns.args
	while (true) {
		for (const host of hosts) {
			await plook(ns, host)
			await ns.sleep(10)
		}
	}
}
