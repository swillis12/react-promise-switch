//@flow
import * as React from "react";

import makeCancelable, { type CancelablePromise } from "./makeCancelable.js";

type REQUEST_STATE = "PENDING" | "ERROR" | "SUCCESS";

type SharedProps<T> = {|
    /**
     * Called whenever the provided promise should be canceled
     */
    cancel?: () => void,

    /**
     * Called whenever the request state changes
     */
    onChange?: (error: mixed, data: ?T, request_state: REQUEST_STATE) => void,

    /**
     * A function returning the promise that react-promise-state should initiate
     */
    promise: () => Promise<T>,

    /**
     * Gives the ability to force an update without forcing the parent to re-render
     */
    refresh?: (cb: () => void) => mixed,
|};

type ChildProps<T> = {|
    ...SharedProps<T>,

    /**
     * Simple shared render function for all request_states
     */
    children: (error: mixed, data: ?T, request_state: REQUEST_STATE) => React.Node,
|};

type SwitchProps<T> = {|
    ...SharedProps<T>,
    renderError: (error: mixed) => React.Node,
    renderPending: () => React.Node,
    renderSuccess: (data: T) => React.Node,
|};

type Props<T> = SharedProps<T> | (ChildProps<T> | SwitchProps<T>);

type State<T> = {|
    data?: T,
    error: mixed,
    request: CancelablePromise<T>,
    request_state: REQUEST_STATE,
|};

/**
 * Build a cancelable promise object, defaulting to the cancel prop if provided
 */
function buildRequest<T>(props: Props<T>): CancelablePromise<T> {
    return props.cancel
        ? { cancel: props.cancel, promise: props.promise }
        : makeCancelable(props.promise);
}

/**
 * Get the default / reset state of the component
 */
function getPendingState<T>(props: Props<T>): State<T> {
    return {
        data: undefined,
        error: undefined,
        request: buildRequest<T>(props),
        request_state: "PENDING",
    };
}

/**
 * React Promise Switch abstracts the overhead and complexity of using promises to store and render data in a component's state.
 */
class ReactPromiseSwitch<T = any> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        super(props);
        this.state = getPendingState<T>(props);

        if (typeof this.props.refresh === "function") {
            this.props.refresh(this.refresh);
        }
    }

    promiseInstance: ?Promise<T> = null;

    /**
     * Cancel the request if it is pending
     */
    cancelPendingRequest = () => {
        if (this.promiseInstance && this.state.request_state === "PENDING") {
            this.state.request.cancel(this.promiseInstance);
        }
    };

    refresh = () => {
        this.cancelPendingRequest();
        this.initiateRequest();
    };

    /**
     * Call the function that returns the cancelable promise
     */
    initiateRequest = () => {
        this.promiseInstance = this.state.request.promise();
        this.promiseInstance
            .then((data: T) => this.setState({ data, request_state: "SUCCESS" }))
            .catch((error: mixed) => this.setState({ error, request_state: "ERROR" }));
    };

    componentDidMount() {
        this.initiateRequest();
    }

    componentDidUpdate(prevProps: Props<T>, prevState: State<T>) {
        if (
            typeof this.props.onChange === "function" &&
            this.state.request_state !== prevState.request_state
        ) {
            this.props.onChange(this.state.error, this.state.data, this.state.request_state);
        }

        // If the provided promise is changed, we should cancel the pending promise
        // to avoid a race condition and because we don't care about the old result anyways.
        if (this.props.promise !== prevProps.promise) {
            // Then we should reset the state and initiate the new promise
            this.setState(getPendingState<T>(this.props), () => {
                this.initiateRequest();
            });
        }
    }

    componentWillUnmount() {
        // We should always cancel requests when the component is unmounting
        // so that we don't accidentally set state on it later.
        this.cancelPendingRequest();

        if (typeof this.props.refresh === "function") {
            this.props.refresh(() => undefined);
        }
    }

    render() {
        const { data, error, request_state } = this.state;

        // If the child function is defined, it should take precedence over the switch props
        if (typeof this.props.children === "function") {
            return this.props.children(error, data, request_state);
        }

        switch (request_state) {
            case "PENDING":
                if (typeof this.props.renderPending !== "function") {
                    return null;
                }
                return this.props.renderPending();
            case "SUCCESS":
                if (typeof this.props.renderSuccess !== "function") {
                    return null;
                }
                if (data === undefined) return null;
                return this.props.renderSuccess(data);
            case "ERROR":
            default:
                if (typeof this.props.renderError !== "function") {
                    return null;
                }
                return this.props.renderError(error);
        }
    }
}

export default ReactPromiseSwitch;
