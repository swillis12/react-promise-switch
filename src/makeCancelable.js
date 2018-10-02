//@flow
export type CancelablePromise<T = any> = {|
    promise: () => Promise<T>,
    cancel: (promise?: Promise<T>) => void,
|};

export default <T>(promise: () => Promise<T>): CancelablePromise<T> => {
    let canceled = false;

    return {
        promise: () =>
            new Promise((resolve, reject) => {
                promise()
                    .then((data: T) => (canceled ? undefined : resolve(data)))
                    .catch((error: mixed) => (canceled ? undefined : reject(error)));
            }),
        cancel: () => {
            canceled = true;
        },
    };
};
