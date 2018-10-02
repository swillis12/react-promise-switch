# React Promise Switch &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/erictooth/react-promise-switch/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-promise-switch.svg?style=flat-square)](https://www.npmjs.com/package/react-promise-switch) ![flow coverage](https://img.shields.io/badge/flow--coverage-100%25-brightgreen.svg?style=flat-square) ![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

React Promise Switch abstracts the overhead and complexity of using promises to store and render data in a component's state.

## Example

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

-   Not forcing the developer to write boilerplate _switch_ logic (which component to show depending on the state of the promise). This can sometimes be error-prone and is unnecessary considering that we can accomplish the same thing by moving this logic into the component itself. That said, there are some cases where it can be a little cleaner to use one component for all three states, which is why the children API is also provided.
-   Simply requiring a promise rather than attempting to wrap and restrict the developer to a library like Axios.
-   Automatically canceling the promise when unmounted or re-rendered with a different request function. The `cancel` prop can be provided for libraries like [Axios](https://github.com/axios/axios/blob/master/README.md#cancellation) that support cancelling out of the box. This makes it trivial to fetch data without having to worry about accidentally setting state on an unmounted component.
-   Not needing a Medium article for such a simple component :)

## Usage

### Switch API

The simplest usage is to allow `react-promise-switch` to decide what to render when the state of the promise changes. This usage is most common when you want to load data once when the component is rendered.

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

### onChange API

Sometimes you need to remember previous results while waiting for a new request to finish. Consider the feature of “live search”, where a user begins typing and a filtered list of results is shown. In this scenario, you want to continue showing the old list of results until the new list returns. In these cases, you could think of `react-promise-switch` as a sort of _input_ and record its changes in your parent component’s state:

```jsx
import * as React from "react";
import ReactPromiseSwitch from "react-promise-switch";

const fetchUsers = query => () =>
    fetch("https://jsonplaceholder.typicode.com/users").then(res =>
        res.json().then(users => users.filter(user => user.name.indexOf(query) !== -1))
    );

export default class LiveSearch extends React.Component {
    state = {
        query: "",
        users: []
    };
    handleInput = e => {
        this.setState({ query: e.target.value });
    };
    handleUsersChange = (err, users, request_state) => {
        if (request_state === "SUCCESS") {
            this.setState({ users });
        }
    };
    render() {
        return (
            <div>
                <input type="text" value={this.state.query} onChange={this.handleInput} />

                <ReactPromiseSwitch
                    promise={fetchUsers(this.state.query)}
                    onChange={this.handleUsersChange}
                />

                <ul>
                    {this.state.users.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
        );
    }
}
```

### Children API

If you want to use the same component to handle all of the request states, it can be simpler to use the children API instead of the switch API:

```jsx
import * as React from "react";
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

## Additional Details

### Canceling A Promise

Although cancelation is provided out of the box, it’s helpful to integrate cancelation more deeply when available such as with libraries like [Axios](https://github.com/axios/axios/blob/master/README.md#cancellation). `react-promise-switch` will call the cancel function for you when needed automatically.

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

### Flow Coverage

By offering 100% [Flow](https://flow.org/) coverage, it’s very simple to integrate this library into existing Flow projects. The exported class accepts a generic parameter — but until Flow supports JSX component generics, the return type you provide to the `promise` prop will be inferred all the way down to the `data` argument provided in each of the different APIs. Eventually I’d like to add [TypeScript](https://www.typescriptlang.org/) coverage as well — but until I have time, contributions are welcomed!
