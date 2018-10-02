import React from "react";
import { shallow } from "enzyme";
import sinon from "sinon";
import sinonStubPromise from "sinon-stub-promise";
import ReactPromiseSwitch from "../index.js";

sinonStubPromise(sinon);

it("re-renders when promise state changes", done => {
    const promise = sinon.stub().returnsPromise();
    const childrenCb = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise}>{childrenCb}</ReactPromiseSwitch>);

    expect(childrenCb.mock.calls.length).toBe(1);

    promise.resolves();

    setImmediate(() => {
        expect(childrenCb.mock.calls.length).toBe(2);
        done();
    });
});

it("renders children promise with fullfilled data", done => {
    const expected = { some: "object" };
    const promise = sinon
        .stub()
        .returnsPromise()
        .resolves(expected);
    const childrenCb = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise}>{childrenCb}</ReactPromiseSwitch>);

    setImmediate(() => {
        expect(childrenCb.mock.calls[1][1]).toBe(expected);
        done();
    });
});

it("renders children promise with rejected error", done => {
    const expected = { some: "error" };
    const promise = sinon
        .stub()
        .returnsPromise()
        .rejects(expected);
    const childrenCb = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise}>{childrenCb}</ReactPromiseSwitch>);

    setImmediate(() => {
        expect(childrenCb.mock.calls[1][0]).toBe(expected);
        done();
    });
});

it("does not call onChange on initial render", done => {
    const promise = sinon.stub().returnsPromise();
    const onChange = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} onChange={onChange} />);

    setImmediate(() => {
        expect(onChange.mock.calls.length).toBe(0);
        done();
    });
});

it("calls onChange when promise is fulfilled", done => {
    const expected = { some: "data" };
    const promise = sinon
        .stub()
        .returnsPromise()
        .resolves(expected);
    const onChange = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} onChange={onChange} />);

    setImmediate(() => {
        expect(onChange.mock.calls[0][0]).toBe(undefined);
        expect(onChange.mock.calls[0][1]).toBe(expected);
        expect(onChange.mock.calls[0][2]).toBe("SUCCESS");
        done();
    });
});

it("calls onChange when promise is rejected", done => {
    const expected = { some: "error" };
    const promise = sinon
        .stub()
        .returnsPromise()
        .rejects(expected);
    const onChange = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} onChange={onChange} />);

    setImmediate(() => {
        expect(onChange.mock.calls[0][0]).toBe(expected);
        expect(onChange.mock.calls[0][1]).toBe(undefined);
        expect(onChange.mock.calls[0][2]).toBe("ERROR");
        done();
    });
});

it("calls renderSuccess when promise is fulfilled", done => {
    const expected = { some: "data" };
    const promise = sinon
        .stub()
        .returnsPromise()
        .resolves(expected);
    const renderSuccess = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} renderSuccess={renderSuccess} />);

    setImmediate(() => {
        expect(renderSuccess.mock.calls[0][0]).toBe(expected);
        done();
    });
});

it("doesn't call renderSuccess if promise resolves with undefined", done => {
    const promise = sinon
        .stub()
        .returnsPromise()
        .resolves(undefined);
    const renderSuccess = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} renderSuccess={renderSuccess} />);

    setImmediate(() => {
        expect(renderSuccess.mock.calls.length).toBe(0);
        done();
    });
});

it("calls renderError when promise is rejected", done => {
    const expected = { some: "error" };
    const promise = sinon
        .stub()
        .returnsPromise()
        .rejects(expected);
    const renderError = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} renderError={renderError} />);

    setImmediate(() => {
        expect(renderError.mock.calls[0][0]).toBe(expected);
        done();
    });
});

it("calls renderPending when initially mounted", done => {
    const promise = sinon.stub().returnsPromise();
    const renderPending = jest.fn();
    shallow(<ReactPromiseSwitch promise={promise} renderPending={renderPending} />);

    setImmediate(() => {
        expect(renderPending.mock.calls.length).toBe(1);
        done();
    });
});