import { Component } from 'react';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var makeCancelable = (function (_promise) {
  var canceled = false;
  return {
    promise: function promise() {
      return new Promise(function (resolve, reject) {
        _promise().then(function (data) {
          return canceled ? undefined : resolve(data);
        }).catch(function (error) {
          return canceled ? undefined : reject(error);
        });
      });
    },
    cancel: function cancel() {
      canceled = true;
    }
  };
});

/**
 * Build a cancelable promise object, defaulting to the cancel prop if provided
 */
function buildRequest(props) {
  return props.cancel ? {
    cancel: props.cancel,
    promise: props.promise
  } : makeCancelable(props.promise);
}
/**
 * Get the default / reset state of the component
 */


function getPendingState(props) {
  return {
    data: undefined,
    error: undefined,
    request: buildRequest(props),
    request_state: "PENDING"
  };
}
/**
 * React Promise Switch abstracts the overhead and complexity of using promises to store and render data in a component's state.
 */


var ReactPromiseSwitch =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ReactPromiseSwitch, _React$Component);

  function ReactPromiseSwitch(props) {
    var _this;

    _classCallCheck(this, ReactPromiseSwitch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactPromiseSwitch).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "initiateRequest", function () {
      _this.state.request.promise().then(function (data) {
        return _this.setState({
          data: data,
          request_state: "SUCCESS"
        });
      }).catch(function (error) {
        return _this.setState({
          error: error,
          request_state: "ERROR"
        });
      });
    });

    _this.state = getPendingState(props);
    return _this;
  }
  /**
   * Call the function that returns the cancelable promise
   */


  _createClass(ReactPromiseSwitch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initiateRequest();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (typeof this.props.onChange === "function" && this.state.request_state !== prevState.request_state) {
        this.props.onChange(this.state.error, this.state.data, this.state.request_state);
      } // If the provided promise is changed, we should cancel the pending promise
      // to avoid a race condition and because we don't care about the old result anyways.


      if (this.props.promise !== prevProps.promise) {
        if (this.state.request_state === "PENDING") {
          this.state.request.cancel();
        } // Then we should reset the state and initiate the new promise


        this.setState(getPendingState(this.props), function () {
          _this2.initiateRequest();
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // We should always cancel requests when the component is unmounting
      // so that we don't accidentally set state on it later.
      if (this.state.request_state === "PENDING") {
        this.state.request.cancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          data = _this$state.data,
          error = _this$state.error,
          request_state = _this$state.request_state; // If the child function is defined, it should take precedence over the switch props

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
  }]);

  return ReactPromiseSwitch;
}(Component);

export default ReactPromiseSwitch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWtlQ2FuY2VsYWJsZS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL0BmbG93XG5leHBvcnQgdHlwZSBDYW5jZWxhYmxlUHJvbWlzZTxUID0gYW55PiA9IHt8IHByb21pc2U6ICgpID0+IFByb21pc2U8VD4sIGNhbmNlbDogKCkgPT4gdm9pZCB8fTtcblxuZXhwb3J0IGRlZmF1bHQgPFQ+KHByb21pc2U6ICgpID0+IFByb21pc2U8VD4pOiBDYW5jZWxhYmxlUHJvbWlzZTxUPiA9PiB7XG4gICAgbGV0IGNhbmNlbGVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlOiAoKSA9PlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21pc2UoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoZGF0YTogVCkgPT4gKGNhbmNlbGVkID8gdW5kZWZpbmVkIDogcmVzb2x2ZShkYXRhKSkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IG1peGVkKSA9PiAoY2FuY2VsZWQgPyB1bmRlZmluZWQgOiByZWplY3QoZXJyb3IpKSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgY2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgfTtcbn07XG4iLCIvL0BmbG93XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IG1ha2VDYW5jZWxhYmxlLCB7IHR5cGUgQ2FuY2VsYWJsZVByb21pc2UgfSBmcm9tIFwiLi9tYWtlQ2FuY2VsYWJsZS5qc1wiO1xuXG50eXBlIFJFUVVFU1RfU1RBVEUgPSBcIlBFTkRJTkdcIiB8IFwiRVJST1JcIiB8IFwiU1VDQ0VTU1wiO1xuXG50eXBlIFNoYXJlZFByb3BzPFQ+ID0ge3xcbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbmV2ZXIgdGhlIHByb3ZpZGVkIHByb21pc2Ugc2hvdWxkIGJlIGNhbmNlbGVkXG4gICAgICovXG4gICAgY2FuY2VsPzogKCkgPT4gdm9pZCxcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBwcm9taXNlIHRoYXQgcmVhY3QtcHJvbWlzZS1zdGF0ZSBzaG91bGQgaW5pdGlhdGVcbiAgICAgKi9cbiAgICBwcm9taXNlOiAoKSA9PiBQcm9taXNlPFQ+LFxufH07XG5cbnR5cGUgQ2hpbGRQcm9wczxUPiA9IHt8XG4gICAgLi4uU2hhcmVkUHJvcHM8VD4sXG5cbiAgICAvKipcbiAgICAgKiBTaW1wbGUgc2hhcmVkIHJlbmRlciBmdW5jdGlvbiBmb3IgYWxsIHJlcXVlc3Rfc3RhdGVzXG4gICAgICovXG4gICAgY2hpbGRyZW46IChlcnJvcjogbWl4ZWQsIGRhdGE6ID9ULCByZXF1ZXN0X3N0YXRlOiBSRVFVRVNUX1NUQVRFKSA9PiBSZWFjdC5Ob2RlLFxufH07XG5cbnR5cGUgU3dpdGNoUHJvcHM8VD4gPSB7fFxuICAgIC4uLlNoYXJlZFByb3BzPFQ+LFxuICAgIHJlbmRlckVycm9yOiAoZXJyb3I6IG1peGVkKSA9PiBSZWFjdC5Ob2RlLFxuICAgIHJlbmRlclBlbmRpbmc6ICgpID0+IFJlYWN0Lk5vZGUsXG4gICAgcmVuZGVyU3VjY2VzczogKGRhdGE6IFQpID0+IFJlYWN0Lk5vZGUsXG58fTtcblxudHlwZSBJbnB1dFByb3BzPFQ+ID0ge3xcbiAgICAuLi5TaGFyZWRQcm9wczxUPixcblxuICAgIC8qKlxuICAgICAqIFVzZWQgd2hlbiB0aGUgY29tcG9uZW50IHNob3VsZCBhY3QgYXMgYW4gaW5wdXQgcmF0aGVyIHRoYW4gYSByZW5kZXIgaGVscGVyXG4gICAgICovXG4gICAgb25DaGFuZ2U6IChlcnJvcjogbWl4ZWQsIGRhdGE6ID9ULCByZXF1ZXN0X3N0YXRlOiBSRVFVRVNUX1NUQVRFKSA9PiB2b2lkLFxufH07XG5cbnR5cGUgUHJvcHM8VD4gPSBDaGlsZFByb3BzPFQ+IHwgU3dpdGNoUHJvcHM8VD4gfCBJbnB1dFByb3BzPFQ+O1xuXG50eXBlIFN0YXRlPFQ+ID0ge3xcbiAgICBkYXRhPzogVCxcbiAgICBlcnJvcjogbWl4ZWQsXG4gICAgcmVxdWVzdDogQ2FuY2VsYWJsZVByb21pc2U8VD4sXG4gICAgcmVxdWVzdF9zdGF0ZTogUkVRVUVTVF9TVEFURSxcbnx9O1xuXG4vKipcbiAqIEJ1aWxkIGEgY2FuY2VsYWJsZSBwcm9taXNlIG9iamVjdCwgZGVmYXVsdGluZyB0byB0aGUgY2FuY2VsIHByb3AgaWYgcHJvdmlkZWRcbiAqL1xuZnVuY3Rpb24gYnVpbGRSZXF1ZXN0PFQ+KHByb3BzOiBQcm9wczxUPik6IENhbmNlbGFibGVQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gcHJvcHMuY2FuY2VsXG4gICAgICAgID8geyBjYW5jZWw6IHByb3BzLmNhbmNlbCwgcHJvbWlzZTogcHJvcHMucHJvbWlzZSB9XG4gICAgICAgIDogbWFrZUNhbmNlbGFibGUocHJvcHMucHJvbWlzZSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBkZWZhdWx0IC8gcmVzZXQgc3RhdGUgb2YgdGhlIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBnZXRQZW5kaW5nU3RhdGU8VD4ocHJvcHM6IFByb3BzPFQ+KTogU3RhdGU8VD4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgcmVxdWVzdDogYnVpbGRSZXF1ZXN0PFQ+KHByb3BzKSxcbiAgICAgICAgcmVxdWVzdF9zdGF0ZTogXCJQRU5ESU5HXCIsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBSZWFjdCBQcm9taXNlIFN3aXRjaCBhYnN0cmFjdHMgdGhlIG92ZXJoZWFkIGFuZCBjb21wbGV4aXR5IG9mIHVzaW5nIHByb21pc2VzIHRvIHN0b3JlIGFuZCByZW5kZXIgZGF0YSBpbiBhIGNvbXBvbmVudCdzIHN0YXRlLlxuICovXG5jbGFzcyBSZWFjdFByb21pc2VTd2l0Y2g8VCA9IGFueT4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHM8VD4sIFN0YXRlPFQ+PiB7XG4gICAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzPFQ+KSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IGdldFBlbmRpbmdTdGF0ZTxUPihwcm9wcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbCB0aGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjYW5jZWxhYmxlIHByb21pc2VcbiAgICAgKi9cbiAgICBpbml0aWF0ZVJlcXVlc3QgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGUucmVxdWVzdFxuICAgICAgICAgICAgLnByb21pc2UoKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGE6IFQpID0+IHRoaXMuc2V0U3RhdGUoeyBkYXRhLCByZXF1ZXN0X3N0YXRlOiBcIlNVQ0NFU1NcIiB9KSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IG1peGVkKSA9PiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIHJlcXVlc3Rfc3RhdGU6IFwiRVJST1JcIiB9KSk7XG4gICAgfTtcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmluaXRpYXRlUmVxdWVzdCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHM6IFByb3BzPFQ+LCBwcmV2U3RhdGU6IFN0YXRlPFQ+KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVxdWVzdF9zdGF0ZSAhPT0gcHJldlN0YXRlLnJlcXVlc3Rfc3RhdGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUuZXJyb3IsIHRoaXMuc3RhdGUuZGF0YSwgdGhpcy5zdGF0ZS5yZXF1ZXN0X3N0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBwcm92aWRlZCBwcm9taXNlIGlzIGNoYW5nZWQsIHdlIHNob3VsZCBjYW5jZWwgdGhlIHBlbmRpbmcgcHJvbWlzZVxuICAgICAgICAvLyB0byBhdm9pZCBhIHJhY2UgY29uZGl0aW9uIGFuZCBiZWNhdXNlIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlIG9sZCByZXN1bHQgYW55d2F5cy5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMucHJvbWlzZSAhPT0gcHJldlByb3BzLnByb21pc2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnJlcXVlc3Rfc3RhdGUgPT09IFwiUEVORElOR1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXF1ZXN0LmNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGVuIHdlIHNob3VsZCByZXNldCB0aGUgc3RhdGUgYW5kIGluaXRpYXRlIHRoZSBuZXcgcHJvbWlzZVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShnZXRQZW5kaW5nU3RhdGU8VD4odGhpcy5wcm9wcyksICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYXRlUmVxdWVzdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgLy8gV2Ugc2hvdWxkIGFsd2F5cyBjYW5jZWwgcmVxdWVzdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIHVubW91bnRpbmdcbiAgICAgICAgLy8gc28gdGhhdCB3ZSBkb24ndCBhY2NpZGVudGFsbHkgc2V0IHN0YXRlIG9uIGl0IGxhdGVyLlxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5yZXF1ZXN0X3N0YXRlID09PSBcIlBFTkRJTkdcIikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXF1ZXN0LmNhbmNlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yLCByZXF1ZXN0X3N0YXRlIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICAgIC8vIElmIHRoZSBjaGlsZCBmdW5jdGlvbiBpcyBkZWZpbmVkLCBpdCBzaG91bGQgdGFrZSBwcmVjZWRlbmNlIG92ZXIgdGhlIHN3aXRjaCBwcm9wc1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMuY2hpbGRyZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW4oZXJyb3IsIGRhdGEsIHJlcXVlc3Rfc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChyZXF1ZXN0X3N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFwiUEVORElOR1wiOlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5yZW5kZXJQZW5kaW5nICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclBlbmRpbmcoKTtcbiAgICAgICAgICAgIGNhc2UgXCJTVUNDRVNTXCI6XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLnJlbmRlclN1Y2Nlc3MgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyU3VjY2VzcyhkYXRhKTtcbiAgICAgICAgICAgIGNhc2UgXCJFUlJPUlwiOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMucmVuZGVyRXJyb3IgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdFByb21pc2VTd2l0Y2g7XG4iXSwibmFtZXMiOlsicHJvbWlzZSIsImNhbmNlbGVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ0aGVuIiwiZGF0YSIsInVuZGVmaW5lZCIsImNhdGNoIiwiZXJyb3IiLCJjYW5jZWwiLCJidWlsZFJlcXVlc3QiLCJwcm9wcyIsIm1ha2VDYW5jZWxhYmxlIiwiZ2V0UGVuZGluZ1N0YXRlIiwicmVxdWVzdCIsInJlcXVlc3Rfc3RhdGUiLCJSZWFjdFByb21pc2VTd2l0Y2giLCJzdGF0ZSIsInNldFN0YXRlIiwiaW5pdGlhdGVSZXF1ZXN0IiwicHJldlByb3BzIiwicHJldlN0YXRlIiwib25DaGFuZ2UiLCJjaGlsZHJlbiIsInJlbmRlclBlbmRpbmciLCJyZW5kZXJTdWNjZXNzIiwicmVuZGVyRXJyb3IiLCJSZWFjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxzQkFBZSxVQUFJQSxRQUFKLEVBQXdEO01BQy9EQyxRQUFRLEdBQUcsS0FBZjtTQUVPO0lBQ0hELE9BQU8sRUFBRTthQUNMLElBQUlFLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7UUFDN0JKLFFBQU8sR0FDRkssSUFETCxDQUNVLFVBQUNDLElBQUQ7aUJBQWNMLFFBQVEsR0FBR00sU0FBSCxHQUFlSixPQUFPLENBQUNHLElBQUQsQ0FBNUM7U0FEVixFQUVLRSxLQUZMLENBRVcsVUFBQ0MsS0FBRDtpQkFBbUJSLFFBQVEsR0FBR00sU0FBSCxHQUFlSCxNQUFNLENBQUNLLEtBQUQsQ0FBaEQ7U0FGWDtPQURKLENBREs7S0FETjtJQU9IQyxNQUFNLEVBQUUsa0JBQU07TUFDVlQsUUFBUSxHQUFHLElBQVg7O0dBUlI7Q0FISjs7QUNrREE7OztBQUdBLFNBQVNVLFlBQVQsQ0FBeUJDLEtBQXpCLEVBQWdFO1NBQ3JEQSxLQUFLLENBQUNGLE1BQU4sR0FDRDtJQUFFQSxNQUFNLEVBQUVFLEtBQUssQ0FBQ0YsTUFBaEI7SUFBd0JWLE9BQU8sRUFBRVksS0FBSyxDQUFDWjtHQUR0QyxHQUVEYSxjQUFjLENBQUNELEtBQUssQ0FBQ1osT0FBUCxDQUZwQjs7Ozs7OztBQVFKLFNBQVNjLGVBQVQsQ0FBNEJGLEtBQTVCLEVBQXVEO1NBQzVDO0lBQ0hOLElBQUksRUFBRUMsU0FESDtJQUVIRSxLQUFLLEVBQUVGLFNBRko7SUFHSFEsT0FBTyxFQUFFSixZQUFZLENBQUlDLEtBQUosQ0FIbEI7SUFJSEksYUFBYSxFQUFFO0dBSm5COzs7Ozs7O0lBV0VDOzs7Ozs4QkFDVUwsS0FBWixFQUE2Qjs7Ozs7NEZBQ25CQSxLQUFOOzs4RkFPYyxZQUFNO1lBQ2ZNLEtBQUwsQ0FBV0gsT0FBWCxDQUNLZixPQURMLEdBRUtLLElBRkwsQ0FFVSxVQUFDQyxJQUFEO2VBQWEsTUFBS2EsUUFBTCxDQUFjO1VBQUViLElBQUksRUFBSkEsSUFBRjtVQUFRVSxhQUFhLEVBQUU7U0FBckMsQ0FBYjtPQUZWLEVBR0tSLEtBSEwsQ0FHVyxVQUFDQyxLQUFEO2VBQWtCLE1BQUtVLFFBQUwsQ0FBYztVQUFFVixLQUFLLEVBQUxBLEtBQUY7VUFBU08sYUFBYSxFQUFFO1NBQXRDLENBQWxCO09BSFg7S0FUeUI7O1VBRXBCRSxLQUFMLEdBQWFKLGVBQWUsQ0FBSUYsS0FBSixDQUE1Qjs7Ozs7Ozs7Ozt3Q0FhZ0I7V0FDWFEsZUFBTDs7Ozt1Q0FHZUMsV0FBcUJDLFdBQXFCOzs7VUFFckQsT0FBTyxLQUFLVixLQUFMLENBQVdXLFFBQWxCLEtBQStCLFVBQS9CLElBQ0EsS0FBS0wsS0FBTCxDQUFXRixhQUFYLEtBQTZCTSxTQUFTLENBQUNOLGFBRjNDLEVBR0U7YUFDT0osS0FBTCxDQUFXVyxRQUFYLENBQW9CLEtBQUtMLEtBQUwsQ0FBV1QsS0FBL0IsRUFBc0MsS0FBS1MsS0FBTCxDQUFXWixJQUFqRCxFQUF1RCxLQUFLWSxLQUFMLENBQVdGLGFBQWxFO09BTHFEOzs7O1VBVXJELEtBQUtKLEtBQUwsQ0FBV1osT0FBWCxLQUF1QnFCLFNBQVMsQ0FBQ3JCLE9BQXJDLEVBQThDO1lBQ3RDLEtBQUtrQixLQUFMLENBQVdGLGFBQVgsS0FBNkIsU0FBakMsRUFBNEM7ZUFDbkNFLEtBQUwsQ0FBV0gsT0FBWCxDQUFtQkwsTUFBbkI7U0FGc0M7OzthQU1yQ1MsUUFBTCxDQUFjTCxlQUFlLENBQUksS0FBS0YsS0FBVCxDQUE3QixFQUE4QyxZQUFNO1VBQ2hELE1BQUksQ0FBQ1EsZUFBTDtTQURKOzs7OzsyQ0FNZTs7O1VBR2YsS0FBS0YsS0FBTCxDQUFXRixhQUFYLEtBQTZCLFNBQWpDLEVBQTRDO2FBQ25DRSxLQUFMLENBQVdILE9BQVgsQ0FBbUJMLE1BQW5COzs7Ozs2QkFJQzt3QkFDa0MsS0FBS1EsS0FEdkM7VUFDR1osSUFESCxlQUNHQSxJQURIO1VBQ1NHLEtBRFQsZUFDU0EsS0FEVDtVQUNnQk8sYUFEaEIsZUFDZ0JBLGFBRGhCOztVQUlELE9BQU8sS0FBS0osS0FBTCxDQUFXWSxRQUFsQixLQUErQixVQUFuQyxFQUErQztlQUNwQyxLQUFLWixLQUFMLENBQVdZLFFBQVgsQ0FBb0JmLEtBQXBCLEVBQTJCSCxJQUEzQixFQUFpQ1UsYUFBakMsQ0FBUDs7O2NBR0lBLGFBQVI7YUFDUyxTQUFMO2NBQ1EsT0FBTyxLQUFLSixLQUFMLENBQVdhLGFBQWxCLEtBQW9DLFVBQXhDLEVBQW9EO21CQUN6QyxJQUFQOzs7aUJBRUcsS0FBS2IsS0FBTCxDQUFXYSxhQUFYLEVBQVA7O2FBQ0MsU0FBTDtjQUNRLE9BQU8sS0FBS2IsS0FBTCxDQUFXYyxhQUFsQixLQUFvQyxVQUF4QyxFQUFvRDttQkFDekMsSUFBUDs7O2NBRUFwQixJQUFJLEtBQUtDLFNBQWIsRUFBd0IsT0FBTyxJQUFQO2lCQUNqQixLQUFLSyxLQUFMLENBQVdjLGFBQVgsQ0FBeUJwQixJQUF6QixDQUFQOzthQUNDLE9BQUw7O2NBRVEsT0FBTyxLQUFLTSxLQUFMLENBQVdlLFdBQWxCLEtBQWtDLFVBQXRDLEVBQWtEO21CQUN2QyxJQUFQOzs7aUJBRUcsS0FBS2YsS0FBTCxDQUFXZSxXQUFYLENBQXVCbEIsS0FBdkIsQ0FBUDs7Ozs7O0VBM0UwQm1COzs7OyJ9
