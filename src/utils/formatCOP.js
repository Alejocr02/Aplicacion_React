const copFormatter = new Intl.NumberFormat('es-CO', {
	style: 'currency',
	currency: 'COP',
	maximumFractionDigits: 0,
});

export function formatCOP(value) {
	const amount = Number(value);
	const safeAmount = Number.isFinite(amount) ? amount : 0;
	return copFormatter.format(safeAmount);
}

