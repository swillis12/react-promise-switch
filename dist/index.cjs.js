'use strict';

var React = require('react');

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
}(React.Component);

module.exports = ReactPromiseSwitch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvbWFrZUNhbmNlbGFibGUuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9AZmxvd1xuZXhwb3J0IHR5cGUgQ2FuY2VsYWJsZVByb21pc2U8VCA9IGFueT4gPSB7fCBwcm9taXNlOiAoKSA9PiBQcm9taXNlPFQ+LCBjYW5jZWw6ICgpID0+IHZvaWQgfH07XG5cbmV4cG9ydCBkZWZhdWx0IDxUPihwcm9taXNlOiAoKSA9PiBQcm9taXNlPFQ+KTogQ2FuY2VsYWJsZVByb21pc2U8VD4gPT4ge1xuICAgIGxldCBjYW5jZWxlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogKCkgPT5cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGRhdGE6IFQpID0+IChjYW5jZWxlZCA/IHVuZGVmaW5lZCA6IHJlc29sdmUoZGF0YSkpKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBtaXhlZCkgPT4gKGNhbmNlbGVkID8gdW5kZWZpbmVkIDogcmVqZWN0KGVycm9yKSkpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgIGNhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuIiwiLy9AZmxvd1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBtYWtlQ2FuY2VsYWJsZSwgeyB0eXBlIENhbmNlbGFibGVQcm9taXNlIH0gZnJvbSBcIi4vbWFrZUNhbmNlbGFibGUuanNcIjtcblxudHlwZSBSRVFVRVNUX1NUQVRFID0gXCJQRU5ESU5HXCIgfCBcIkVSUk9SXCIgfCBcIlNVQ0NFU1NcIjtcblxudHlwZSBTaGFyZWRQcm9wczxUPiA9IHt8XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW5ldmVyIHRoZSBwcm92aWRlZCBwcm9taXNlIHNob3VsZCBiZSBjYW5jZWxlZFxuICAgICAqL1xuICAgIGNhbmNlbD86ICgpID0+IHZvaWQsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbmV2ZXIgdGhlIHJlcXVlc3Qgc3RhdGUgY2hhbmdlc1xuICAgICAqL1xuICAgIG9uQ2hhbmdlOiAoZXJyb3I6IG1peGVkLCBkYXRhOiA/VCwgcmVxdWVzdF9zdGF0ZTogUkVRVUVTVF9TVEFURSkgPT4gdm9pZCxcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBwcm9taXNlIHRoYXQgcmVhY3QtcHJvbWlzZS1zdGF0ZSBzaG91bGQgaW5pdGlhdGVcbiAgICAgKi9cbiAgICBwcm9taXNlOiAoKSA9PiBQcm9taXNlPFQ+LFxufH07XG5cbnR5cGUgQ2hpbGRQcm9wczxUPiA9IHt8XG4gICAgLi4uU2hhcmVkUHJvcHM8VD4sXG5cbiAgICAvKipcbiAgICAgKiBTaW1wbGUgc2hhcmVkIHJlbmRlciBmdW5jdGlvbiBmb3IgYWxsIHJlcXVlc3Rfc3RhdGVzXG4gICAgICovXG4gICAgY2hpbGRyZW46IChlcnJvcjogbWl4ZWQsIGRhdGE6ID9ULCByZXF1ZXN0X3N0YXRlOiBSRVFVRVNUX1NUQVRFKSA9PiBSZWFjdC5Ob2RlLFxufH07XG5cbnR5cGUgU3dpdGNoUHJvcHM8VD4gPSB7fFxuICAgIC4uLlNoYXJlZFByb3BzPFQ+LFxuICAgIHJlbmRlckVycm9yOiAoZXJyb3I6IG1peGVkKSA9PiBSZWFjdC5Ob2RlLFxuICAgIHJlbmRlclBlbmRpbmc6ICgpID0+IFJlYWN0Lk5vZGUsXG4gICAgcmVuZGVyU3VjY2VzczogKGRhdGE6IFQpID0+IFJlYWN0Lk5vZGUsXG58fTtcblxudHlwZSBQcm9wczxUPiA9IENoaWxkUHJvcHM8VD4gfCBTd2l0Y2hQcm9wczxUPjtcblxudHlwZSBTdGF0ZTxUPiA9IHt8XG4gICAgZGF0YT86IFQsXG4gICAgZXJyb3I6IG1peGVkLFxuICAgIHJlcXVlc3Q6IENhbmNlbGFibGVQcm9taXNlPFQ+LFxuICAgIHJlcXVlc3Rfc3RhdGU6IFJFUVVFU1RfU1RBVEUsXG58fTtcblxuLyoqXG4gKiBCdWlsZCBhIGNhbmNlbGFibGUgcHJvbWlzZSBvYmplY3QsIGRlZmF1bHRpbmcgdG8gdGhlIGNhbmNlbCBwcm9wIGlmIHByb3ZpZGVkXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmVxdWVzdDxUPihwcm9wczogUHJvcHM8VD4pOiBDYW5jZWxhYmxlUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIHByb3BzLmNhbmNlbFxuICAgICAgICA/IHsgY2FuY2VsOiBwcm9wcy5jYW5jZWwsIHByb21pc2U6IHByb3BzLnByb21pc2UgfVxuICAgICAgICA6IG1ha2VDYW5jZWxhYmxlKHByb3BzLnByb21pc2UpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZGVmYXVsdCAvIHJlc2V0IHN0YXRlIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gZ2V0UGVuZGluZ1N0YXRlPFQ+KHByb3BzOiBQcm9wczxUPik6IFN0YXRlPFQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgICAgIHJlcXVlc3Q6IGJ1aWxkUmVxdWVzdDxUPihwcm9wcyksXG4gICAgICAgIHJlcXVlc3Rfc3RhdGU6IFwiUEVORElOR1wiLFxuICAgIH07XG59XG5cbi8qKlxuICogUmVhY3QgUHJvbWlzZSBTd2l0Y2ggYWJzdHJhY3RzIHRoZSBvdmVyaGVhZCBhbmQgY29tcGxleGl0eSBvZiB1c2luZyBwcm9taXNlcyB0byBzdG9yZSBhbmQgcmVuZGVyIGRhdGEgaW4gYSBjb21wb25lbnQncyBzdGF0ZS5cbiAqL1xuY2xhc3MgUmVhY3RQcm9taXNlU3dpdGNoPFQgPSBhbnk+IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzPFQ+LCBTdGF0ZTxUPj4ge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wczxUPikge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBnZXRQZW5kaW5nU3RhdGU8VD4ocHJvcHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGwgdGhlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY2FuY2VsYWJsZSBwcm9taXNlXG4gICAgICovXG4gICAgaW5pdGlhdGVSZXF1ZXN0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlLnJlcXVlc3RcbiAgICAgICAgICAgIC5wcm9taXNlKClcbiAgICAgICAgICAgIC50aGVuKChkYXRhOiBUKSA9PiB0aGlzLnNldFN0YXRlKHsgZGF0YSwgcmVxdWVzdF9zdGF0ZTogXCJTVUNDRVNTXCIgfSkpXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBtaXhlZCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yLCByZXF1ZXN0X3N0YXRlOiBcIkVSUk9SXCIgfSkpO1xuICAgIH07XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5pbml0aWF0ZVJlcXVlc3QoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzOiBQcm9wczxUPiwgcHJldlN0YXRlOiBTdGF0ZTxUPikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnJlcXVlc3Rfc3RhdGUgIT09IHByZXZTdGF0ZS5yZXF1ZXN0X3N0YXRlXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLmVycm9yLCB0aGlzLnN0YXRlLmRhdGEsIHRoaXMuc3RhdGUucmVxdWVzdF9zdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgcHJvdmlkZWQgcHJvbWlzZSBpcyBjaGFuZ2VkLCB3ZSBzaG91bGQgY2FuY2VsIHRoZSBwZW5kaW5nIHByb21pc2VcbiAgICAgICAgLy8gdG8gYXZvaWQgYSByYWNlIGNvbmRpdGlvbiBhbmQgYmVjYXVzZSB3ZSBkb24ndCBjYXJlIGFib3V0IHRoZSBvbGQgcmVzdWx0IGFueXdheXMuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnByb21pc2UgIT09IHByZXZQcm9wcy5wcm9taXNlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5yZXF1ZXN0X3N0YXRlID09PSBcIlBFTkRJTkdcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmVxdWVzdC5jYW5jZWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlbiB3ZSBzaG91bGQgcmVzZXQgdGhlIHN0YXRlIGFuZCBpbml0aWF0ZSB0aGUgbmV3IHByb21pc2VcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoZ2V0UGVuZGluZ1N0YXRlPFQ+KHRoaXMucHJvcHMpLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWF0ZVJlcXVlc3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIC8vIFdlIHNob3VsZCBhbHdheXMgY2FuY2VsIHJlcXVlc3RzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyB1bm1vdW50aW5nXG4gICAgICAgIC8vIHNvIHRoYXQgd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IHNldCBzdGF0ZSBvbiBpdCBsYXRlci5cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucmVxdWVzdF9zdGF0ZSA9PT0gXCJQRU5ESU5HXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVxdWVzdC5jYW5jZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciwgcmVxdWVzdF9zdGF0ZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICAvLyBJZiB0aGUgY2hpbGQgZnVuY3Rpb24gaXMgZGVmaW5lZCwgaXQgc2hvdWxkIHRha2UgcHJlY2VkZW5jZSBvdmVyIHRoZSBzd2l0Y2ggcHJvcHNcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLmNoaWxkcmVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKGVycm9yLCBkYXRhLCByZXF1ZXN0X3N0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocmVxdWVzdF9zdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBcIlBFTkRJTkdcIjpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMucmVuZGVyUGVuZGluZyAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJQZW5kaW5nKCk7XG4gICAgICAgICAgICBjYXNlIFwiU1VDQ0VTU1wiOlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5yZW5kZXJTdWNjZXNzICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclN1Y2Nlc3MoZGF0YSk7XG4gICAgICAgICAgICBjYXNlIFwiRVJST1JcIjpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLnJlbmRlckVycm9yICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RQcm9taXNlU3dpdGNoO1xuIl0sIm5hbWVzIjpbInByb21pc2UiLCJjYW5jZWxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidGhlbiIsImRhdGEiLCJ1bmRlZmluZWQiLCJjYXRjaCIsImVycm9yIiwiY2FuY2VsIiwiYnVpbGRSZXF1ZXN0IiwicHJvcHMiLCJtYWtlQ2FuY2VsYWJsZSIsImdldFBlbmRpbmdTdGF0ZSIsInJlcXVlc3QiLCJyZXF1ZXN0X3N0YXRlIiwiUmVhY3RQcm9taXNlU3dpdGNoIiwic3RhdGUiLCJzZXRTdGF0ZSIsImluaXRpYXRlUmVxdWVzdCIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsIm9uQ2hhbmdlIiwiY2hpbGRyZW4iLCJyZW5kZXJQZW5kaW5nIiwicmVuZGVyU3VjY2VzcyIsInJlbmRlckVycm9yIiwiUmVhY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxzQkFBZSxVQUFJQSxRQUFKLEVBQXdEO01BQy9EQyxRQUFRLEdBQUcsS0FBZjtTQUVPO0lBQ0hELE9BQU8sRUFBRTthQUNMLElBQUlFLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7UUFDN0JKLFFBQU8sR0FDRkssSUFETCxDQUNVLFVBQUNDLElBQUQ7aUJBQWNMLFFBQVEsR0FBR00sU0FBSCxHQUFlSixPQUFPLENBQUNHLElBQUQsQ0FBNUM7U0FEVixFQUVLRSxLQUZMLENBRVcsVUFBQ0MsS0FBRDtpQkFBbUJSLFFBQVEsR0FBR00sU0FBSCxHQUFlSCxNQUFNLENBQUNLLEtBQUQsQ0FBaEQ7U0FG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
