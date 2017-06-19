import React from 'react'
import PropTypes from 'prop-types'

class Page extends React.Component {

	static propTypes = {
		page: PropTypes.object,
	}

	static contextTypes = {
		renderLayer: PropTypes.func,
	}

	render() {
		const page = this.props.page
		console.log(page)
		const {name, layers: childLayers} = page
		const style = {
			background: "#F2F2F2",
			boxSizing: "border-box",
		}
		return (
			<section className="page" data-sketch-name={name} style={style}>
				{childLayers.map(this.context.renderLayer)}
			</section>
		)
	}
}

export default Page