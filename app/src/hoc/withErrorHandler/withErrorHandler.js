import React, { Component } from "react";

import Modal from "../../components/UI/Modal/Modal";

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		state = {
			error: null,
		};

		// componentDidMount() {
		// 	this.reqInterceptor = axios.interceptors.request.use((req) => {
		// 		this.setState({ error: null });
		// 		return req;
		// 	});
		// 	this.resInterceptor = axios.interceptors.response.use(
		// 		(res) => res,
		// 		(error) => {
		// 			console.log(error);
		// 			this.setState({ error: error });
		// 			return Promise.reject(error);
		// 		}
		// 	);
		// }

		// UNSAFE_componentWillMount() {
		// 	this.reqInterceptor = axios.interceptors.request.use((req) => {
		// 		console.log(req);
		// 		this.setState({ error: req.error });
		// 		return req;
		// 	});
		// 	this.resInterceptor = axios.interceptors.response.use(
		// 		(res) => console.log(res),
		// 		(error) => {
		// 			console.log(error);
		// 			this.setState({ error: error });
		// 			return Promise.reject(error);
		// 		}
		// 	);
		// }

		// clear interceptors for prevent using much more than it's needed for each separete component

		componentDidCatch(error, errorInfo) {
			this.setState({ error: errorInfo });
		}

		componentDidMount() {
			this.reqInterceptor = axios.interceptors.request.use(
				(req) => {
					this.setState({ error: null });
					return req;
				},
				(error) => {
					this.setState({ error: error });
					return Promise.reject(error);
				}
			);
			this.resInterceptor = axios.interceptors.response.use(
				(res) => res,
				(error) => {
					this.setState({ error: error });
					return Promise.reject(error);
				}
			);
		}
		componentWillUnmount() {
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.response.eject(this.resInterceptor);
		}
		errorConfirmedHandler = () => {
			this.setState({ error: null });
		};

		render() {
			return (
				<React.Fragment>
					<Modal
						show={this.state.error}
						modalClosed={this.errorConfirmedHandler}
						zindex={this.state.error}
					>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</React.Fragment>
			);
		}
	};
};

export default withErrorHandler;
