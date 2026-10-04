import { useState } from 'react'

const initialForm = {
	name: '',
	company: '',
	year: '',
	kms_driven: '',
	fuel_type: '',
}

const inputClasses = 'mt-2 h-12 w-full rounded border border-[#d5ded7] bg-white px-3 text-sm font-normal text-[#1b2924] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#507565] focus:ring-2 focus:ring-[#507565]/15'

function App() {
	const [form, setForm] = useState(initialForm)
	const [estimate, setEstimate] = useState(null)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	function updateField(event) {
		const { name, value } = event.target
		setForm((current) => ({ ...current, [name]: value }))
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setLoading(true)
		setError('')
		setEstimate(null)

		try {
			const response = await fetch('/api/predict', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...form,
					year: Number(form.year),
					kms_driven: Number(form.kms_driven),
				}),
			})
			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Could not estimate this car price.')
			}

			setEstimate(result.estimatedPrice)
		} catch (requestError) {
			setError(requestError.message || 'Unable to reach the prediction service.')
		} finally {
			setLoading(false)
		}
	}

	const formattedEstimate = estimate === null
		? null
		: new Intl.NumberFormat('en-IN', {
				style: 'currency',
				currency: 'INR',
				maximumFractionDigits: 0,
			}).format(estimate)

	return (
		<main className="mx-auto flex min-h-screen w-[min(1120px,calc(100%-40px))] flex-col text-[#1b2924] sm:w-[min(1120px,calc(100%-64px))]">
			<header className="flex min-h-[76px] items-center justify-between border-b border-[#dce4de]">
				<a className="flex items-center gap-2.5 text-base font-bold text-[#1b2924] no-underline" href="/" aria-label="Motorvalue home">
					<span className="grid size-7 place-items-center bg-[#bf553d] font-serif text-lg text-white">M</span>
					<span>motorvalue</span>
				</a>
				<span className="max-w-28 text-right text-[10px] font-bold tracking-[1.2px] text-[#718078] sm:max-w-none">USED CAR PRICE ESTIMATOR</span>
			</header>

			<section className="flex-1 py-11 sm:py-14" aria-labelledby="page-title">
				<div className="mb-8 max-w-2xl sm:mb-10">
					<p className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-[1.2px] text-[#61736a]">
						<span className="size-2 rounded-full bg-[#d56b4b]" /> MARKET ESTIMATE
					</p>
					<h1 id="page-title" className="mb-4 font-serif text-[42px] font-normal leading-[1.05] sm:text-6xl">
						A clearer price<br />for your next move.
					</h1>
					<p className="max-w-lg text-sm leading-7 text-[#617068] sm:text-[15px]">
						Add a few details about the car to get an instant estimate based on the vehicle data in our model.
					</p>
				</div>

				<div className="grid items-start gap-7 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12">
					<form className="border-t-2 border-[#243b31] pt-5" onSubmit={handleSubmit}>
						<div className="mb-6 flex items-end justify-between gap-4">
							<div>
								<p className="mb-2 text-[10px] font-bold tracking-[1.2px] text-[#b6573e]">01 / VEHICLE</p>
								<h2 className="text-xl font-semibold">Tell us about the car</h2>
							</div>
							<span className="pb-0.5 text-xs text-[#78847d]">All fields required</span>
						</div>

						<div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
							<label className="min-w-0 text-xs font-semibold text-[#35473e] sm:col-span-2">
								Model name
								<input
									className={inputClasses}
									name="name"
									value={form.name}
									onChange={updateField}
									placeholder="e.g. Swift Dzire VDI"
									autoComplete="off"
									required
								/>
							</label>

							<label className="min-w-0 text-xs font-semibold text-[#35473e]">
								Company
								<input
									className={inputClasses}
									name="company"
									value={form.company}
									onChange={updateField}
									placeholder="e.g. Maruti"
									autoComplete="organization"
									required
								/>
							</label>

							<label className="min-w-0 text-xs font-semibold text-[#35473e]">
								Fuel type
								<select className={`${inputClasses} invalid:text-[#a1aaa4]`} name="fuel_type" value={form.fuel_type} onChange={updateField} required>
									<option value="" disabled>Select fuel</option>
									<option value="Petrol">Petrol</option>
									<option value="Diesel">Diesel</option>
									<option value="CNG">CNG</option>
									<option value="LPG">LPG</option>
									<option value="Electric">Electric</option>
								</select>
							</label>

							<label className="min-w-0 text-xs font-semibold text-[#35473e]">
								Year of manufacture
								<input
									className={inputClasses}
									name="year"
									type="number"
									min="1950"
									max={new Date().getFullYear()}
									step="1"
									value={form.year}
									onChange={updateField}
									placeholder="2018"
									required
								/>
							</label>

							<label className="min-w-0 text-xs font-semibold text-[#35473e]">
								Distance driven
								<span className="relative block">
									<input
										className={`${inputClasses} pr-12`}
										name="kms_driven"
										type="number"
										min="0"
										step="1"
										value={form.kms_driven}
										onChange={updateField}
										placeholder="45000"
										required
									/>
									<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-normal text-[#7c8981]">km</span>
								</span>
							</label>
						</div>

						{error && <p className="mt-4 text-[13px] leading-5 text-[#a43f32]" role="alert">{error}</p>}

						<div className="mt-7 flex flex-col items-stretch gap-4 border-t border-[#dce4de] pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
							<p className="max-w-[260px] text-[11px] leading-5 text-[#78847d]">
								Estimates are indicative and may differ from the final sale price.
							</p>
							<button
								className="inline-flex min-h-12 min-w-[174px] items-center justify-between gap-5 rounded-sm bg-[#b84e36] px-4 text-[13px] font-semibold text-white transition hover:bg-[#9f402d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b84e36] disabled:cursor-wait disabled:opacity-70"
								type="submit"
								disabled={loading}
							>
								{loading ? 'Calculating…' : 'Estimate price'}
								<span aria-hidden="true" className="text-xl font-normal">→</span>
							</button>
						</div>
					</form>

					<aside className="min-h-[220px] bg-[#20372d] p-5 text-white md:mt-4" aria-live="polite">
						<div className="flex items-center gap-2 text-[10px] font-bold tracking-[1.2px] text-[#dce7df]">
							<span className="size-[7px] rounded-full bg-[#e98768]" /> YOUR ESTIMATE
						</div>
						<p className={`mt-8 break-words font-serif text-[34px] leading-tight sm:text-[38px] ${formattedEstimate ? 'text-white' : 'tracking-[2px] text-[#8fa197]'}`}>
							{formattedEstimate || '— — —'}
						</p>
						<p className="text-xs text-[#b8c7bd]">
							{formattedEstimate ? 'Predicted resale price' : 'Your estimate will appear here'}
						</p>
						<div className="my-6 h-px bg-white/15" />
						<p className="text-[10px] leading-4 text-[#b8c7bd]">Based on the details entered and the model’s training data.</p>
					</aside>
				</div>
			</section>

			<footer className="flex min-h-[58px] items-center justify-between gap-4 border-t border-[#dce4de] text-[11px] text-[#7b8980]">
				<span>Motorvalue <span className="px-1 text-[#bd6349]">/</span> Vehicle valuation</span>
				<span>For guidance only</span>
			</footer>
		</main>
	)
}

export default App
