//@flow
export type CancellablePromise = {| promise: () => Promise<any>, cancel: () => void |};

export default (promise: () => Promise<any>): CancellablePromise => {
    let canceled = false;

    return {
        promise: () =>
            new Promise((resolve, reject) => {
                promise()
                    .then(data => (canceled ? undefined : resolve(data)))
                    .catch(error => (canceled ? undefined : reject(error)));
            }),
        cancel: () => {
            canceled = true;
        },
    };
};
