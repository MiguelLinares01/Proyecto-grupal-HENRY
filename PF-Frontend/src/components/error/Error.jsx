import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const Error = () => {
	const { fetchError } = useSelector((state) => state.requests)
	const [visible, setVisible] = useState(false)

	useEffect(() => {		if (fetchError) setVisible(true)
		const timer = setTimeout(() => {
			setVisible(false)
		}, 8000)
		return () => clearTimeout(timer)
	}, [fetchError])

	if (!visible) {
		return null
	}

	return (
		fetchError && (
			<div
				style={{
					boxSizing: 'border-box',
					minWidth: '20vw',
					padding: '1rem 2rem',
					margin: 'auto',
					color: 'black',
					outline: 'solid 1.5px rgba(196, 95, 95, 0.836)',
					borderRadius: '0.5rem',
					background: 'rgba(248, 231, 231, 0.863)',
					position: 'fixed',
					bottom: '4vh',
					right: '2vw',
					zIndex: 100,
				}}
			>
				<p style={{ margin: 0 }}>{fetchError[0]}</p>
			</div>
		)
	)
}

export default Error
