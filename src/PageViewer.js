import React from 'react'
import PropTypes from 'prop-types'

class PageViewer extends React.Component {

	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state = {
		dragging: false,
		zooming: false,
		startPoint: null,
		panStart: {x: 0, y: 0},
		panEnd: {x: 0, y: 0},
		zoom: 1,
	}

	startDrag = e => {
		const {clientX: x, clientY: y} = e
		this.setState({dragging: true, startPoint: {x, y}})
	}

	onDrag = e => {
		if (!this.state.dragging) return

		const {x: x0, y: y0} = this.state.panStart
		const {x: x1, y: y1} = this.state.startPoint
		const {clientX: x2, clientY: y2} = e
		const dx = x2 - x1, dy = y2 - y1
		this.setState({panEnd: {x: x0 + dx, y: y0 + dy}})
	}

	endDrag = e => {
		this.setState({dragging: false, startPoint: null, panStart: this.state.panEnd})
	}

	onWheel = e => {
		e.stopPropagation()
		e.preventDefault()

		// scroll too narrow
		if (Math.abs(Math.atan(e.deltaY / e.deltaX)) < 1) {
			return
		}

		if (e.deltaY > 0) {
			this.setState(prevState => ({zooming: true, zoom: prevState.zoom * 0.99}))
		} else if (e.deltaY < 0) {
			this.setState(prevState => ({zooming: true, zoom: prevState.zoom * 1.01}))
		}
}

	render() {
		const {x, y} = this.state.panEnd
		const {zoom} = this.state

		return (
			<div
				className="page-viewer"
				onMouseDown={this.startDrag}
				onMouseMove={this.onDrag}
				onMouseUp={this.endDrag}
				onWheel={this.onWheel}
			>
				<div className="page-transform" style={{transform: `translate3D(${x}px, ${y}px, 0) scale(${zoom})`}}>
					{this.props.children}
				</div>
			</div>
		)
	}

}

export default PageViewer