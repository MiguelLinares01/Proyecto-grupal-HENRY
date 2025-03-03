import React from 'react'
import styled from 'styled-components'

const AcceptContractView = ({ contracts, searchQuery }) => {
	const filteredContracts = contracts.filter(
		(contract) =>
			contract.receiver?.userName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			(contract.id.toString().includes(searchQuery) &&
				contract.status === 'accepted')
	)
console.log(filteredContracts, contracts)
	return (
		<SectionStyled className="ListContracts">
			<div className="accordion accordion-flush" id="accordionFlushExample">
				{filteredContracts && filteredContracts.length > 0 ? (
					filteredContracts.map((contract, index) => (
						<div className="accordion-item" key={contract.id}>
							<h2 className="accordion-header">
								<span
									className="accordion-button collapsed item"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target={`#flush-collapse${index}`}
									aria-expanded="false"
									aria-controls={`flush-collapse${index}`}
								>
									<div className="d-flex justify-content-between w-100 pe-5 flex-wrap">
										<div className="subject">{contract.receiver?.userName}</div>
										<div className="email">{contract.receiver?.email}</div>
									</div>
								</span>
							</h2>
							<div
								id={`flush-collapse${index}`}
								className="accordion-collapse collapse"
								data-bs-parent="#accordionFlushExample"
							>
								<div className="card-body accordion-body card my-2">
									<div className="info">
										<p>Cc: {contract.subject}</p>
										<p>
											Descripción del proyecto: {contract.projectDescription}
										</p>
										<p>
											Presupuesto disponible: {contract.budget}{' '}
											{contract.currency}
										</p>
										<p>Cronología: {contract.availableTime}</p>
										<p>Estado: {contract.status}</p>
										<p>
											Comisión por pago:{' '}
											{contract.commission?.amount !== undefined
												? `${contract.commission?.amount} ${contract.currency}`
												: 'No disponible'}
										</p>
									</div>
									<hr />
								</div>
							</div>
						</div>
					))
				) : (
					<p>No hay contratos aceptados disponibles</p>
				)}
			</div>
		</SectionStyled>
	)
}

export default AcceptContractView

const SectionStyled = styled.section`
	span.item {
		&:hover {
			background-color: #a7abab39;
		}
	}
`
