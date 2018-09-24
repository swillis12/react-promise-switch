# React Promise Switch &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/erictooth/token2css/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-promise-switch.svg)](https://www.npmjs.com/package/react-promise-switch)

React Promise Switch abstracts the overhead and complexity of using promises to store and render data in a component's state.

## Usage

```jsx
import PromiseSwitch from "react-promise-switch";
import { fetchUsers, renderUsers, showError, LoadingIndicator } from "some-other-file";

export default () => (
    <PromiseSwitch
        promise={fetchUsers}
        renderError={error => showError(error)}
        renderPending={() => <LoadingIndicator />}
        renderSuccess={data => renderUsers(data)}
    />
);
```

## Motivation

Although there are a **lot** of other components which solve the same basic problem ([React Data Loader](https://github.com/lucasconstantino/react-data-loader), [React Data Fetching](https://github.com/CharlesMangwa/react-data-fetching), [React Async](https://github.com/ghengeveld/react-async), [react-promise-state](https://github.com/MichalSzorad/react-promise-state), [react-loads](https://github.com/jxom/react-loads)), none of them do it with the simplicity that I expected. This component differs the rest by:

-   Not forcing the developer to write boilerplate _switch_ logic (which component to show depending on the state of the promise). This can sometimes be error-prone and is unnecessary considering that we can accomplish the same thing by moving this logic into the component itself. Sometimes you may need the option of rendering all three states simultaneously — such as showing the last successful response mixed with the last error response _and_ show that a new request is pending. For those cases, the child as a function API is provided.
-   Simply requiring a promise rather than attempting to wrap and restrict the developer to a library like Axios.
-   Automatically canceling the promise when unmounted or re-rendered with a different request function. The `cancel` prop can be provided for libraries like [Axios](https://github.com/axios/axios/blob/master/README.md#cancellation) that support cancelling out of the box. This makes it trivial to fetch data without having to worry about accidentally setting state on an unmounted component.
-   Not needing a Medium article for such a simple component :)

## Examples

### Canceling A Promise

Although cancelation is provided out of the box, it's nice to integrate more directly with libraries like [Axios](https://github.com/axios/axios/blob/master/README.md#cancellation). `<PromiseSwitch />` will cancel the request for you automatically.

```jsx
import PromiseSwitch from "react-promise-switch";
import axios, { CancelToken } from "axios";
import { renderUsers, showError, LoadingIndicator } from "some-other-file";

const source = CancelToken.source();
const fetchUsers = axios.get("/users", { cancelToken: source.token }).then(res => res.data);

export default () => (
    <PromiseSwitch
        cancel={source.cancel}
        promise={fetchUsers}
        renderError={error => showError(error)}
        renderPending={() => <LoadingIndicator />}
        renderSuccess={data => renderUsers(data)}
    />
);
```

### Child as a function

If you want to continue showing old data while a new request is pending, you can provide the same component to `renderPending` and `renderSuccess` (and `renderError` too if needed).

```jsx
import PromiseSwitch from "react-promise-switch";
import { fetchUsers, RenderUsers, LoadingIndicator } from "some-other-file";

export default () => (
    <PromiseSwitch promise={fetchUsers}>
        {(err, data, request_state) => {
            if (request_state === "PENDING") {
                return <LoadingIndicator />;
            }

            return <RenderUsers err={err} data={data} request_state={request_state} />;
        }}
    </PromiseSwitch>
);
```
