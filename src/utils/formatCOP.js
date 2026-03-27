export function formatCOP(value) {
	const amount = Number(value) || 0;

	try {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			maximumFractionDigits: 0,
		}).format(amount);
	} catch {
		return `$${amount}`;
	}
}
