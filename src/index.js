//@flow
import * as React from "react";
import PropTypes from "prop-types";

import makeCancellable, { type CancellablePromise } from "./makeCancellable.js";

type Props = {
    cancel?: () => void,
    promise: () => Promise<any>,
    renderError: (error: any) => React.Node,
    renderPending: (prevData: any) => React.Node,
    renderSuccess: (data: any) => React.Node,
};

type State = {|
    data: any,
    error: any,
    request: ?CancellablePromise,
    request_state: "PENDING" | "ERROR" | "SUCCESS",
|};

class ReactPromiseSwitch extends React.Component<Props, State> {
    static propTypes = {
        cancel: PropTypes.func,
        promise: PropTypes.func.isRequired,
        renderError: PropTypes.func.isRequired,
        renderPending: PropTypes.func.isRequired,
        renderSuccess: PropTypes.func.isRequired,
    };

    state = {
        data: null,
        error: null,
        request: null,
        request_state: "PENDING",
    };

    cancelRequest = () => {
        if (this.state.request_state !== "PENDING" || !this.state.request) {
            return;
        }

        this.state.request.cancel();
    };

    initiateRequest = () => {
        this.cancelRequest();
        const { promise, cancel } = this.props;
        const request = cancel ? { cancel, promise } : makeCancellable(promise);

        this.setState({ request, request_state: "PENDING" }, () => {
            if (!this.state.request) {
                return;
            }

            this.state.request
                .promise()
                .then((data: any) => this.setState({ data, request_state: "SUCCESS" }))
                .catch((error: any) => this.setState({ error, request_state: "ERROR" }));
        });
    };

    componentDidMount() {
        this.initiateRequest();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.promise !== prevProps.promise) {
            this.initiateRequest();
        }
    }

    componentWillUnmount() {
        this.cancelRequest();
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return nextState !== this.state || nextProps.promise !== this.props.promise;
    }

    render() {
        const { data, error, request_state } = this.state;

        switch (request_state) {
            case "PENDING":
                return this.props.renderPending(data);
            case "SUCCESS":
                return this.props.renderSuccess(data);
            case "ERROR":
            default:
                return this.props.renderError(error);
        }
    }
}

export default ReactPromiseSwitch;
