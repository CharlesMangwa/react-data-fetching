"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var shallow_1 = require("react-test-renderer/shallow");
var Fetch_1 = require("../Fetch");
var index_1 = require("../index");
describe("A <Fetch />", function () {
    var fn;
    var renderer;
    beforeEach(function () {
        fn = jest.fn();
        renderer = shallow_1.createRenderer();
    });
    afterEach(function () { return jest.clearAllMocks(); });
    it("should render component `children` correctly", function () {
        expect.assertions(1);
        var component = react_test_renderer_1.default.create(<index_1.Fetch url="https://api.github.com/users/octocat">
        <div />
      </index_1.Fetch>);
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("should render component `children` correctly", function () {
        expect.assertions(1);
        var component = react_test_renderer_1.default.create(<index_1.Fetch url="https://api.github.com/users/octocat">
        <div />
      </index_1.Fetch>);
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("should render & call function children correctly", function () {
        expect.assertions(1);
        var component = react_test_renderer_1.default.create(<index_1.Fetch url="https://api.github.com/users/octocat">
        {function () { return fn() || null; }}
      </index_1.Fetch>);
        var instance = component.root;
        instance.props.children();
        expect(fn).toHaveBeenCalled();
    });
    it("should re-render only when necessary", function () {
        expect.assertions(4);
        var render = function () { return null; };
        var params = { page: 1 };
        var component = react_test_renderer_1.default.create(<Fetch_1.Fetch url="https://api.github.com/users/octocat" cancel={false} loader={render} onError={fn} onFetch={fn} onLoad={fn} path={undefined} params={params} refetchKey={false} render={undefined}>
        {render}
      </Fetch_1.Fetch>);
        var instance = component.getInstance();
        if (instance) {
            var spy1 = jest.spyOn(instance, "fetchData");
            var spy2 = jest.spyOn(instance, "shouldComponentUpdate");
            component.update(<Fetch_1.Fetch url="https://api.github.com/users/octocat" cancel={false} loader={render} onError={fn} onFetch={fn} onLoad={fn} path={undefined} params={params} refetchKey={false} render={undefined}>
          {render}
        </Fetch_1.Fetch>);
            expect(spy1).not.toHaveBeenCalled();
            expect(spy2).toHaveReturnedWith(false);
            component.update(<Fetch_1.Fetch url="https://api.github.com/users/octocat" refetchKey>
          <div />
        </Fetch_1.Fetch>);
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveReturnedWith(true);
        }
    });
    it("should call `onLoad` when passed", function () {
        expect.assertions(1);
        renderer.render(<Fetch_1.Fetch onLoad={fn} url="https://api.github.com/users/octocat" render={function () { return null; }}/>);
        expect(fn).toHaveBeenCalled();
    });
    it("should call `loader` when passed", function () {
        expect.assertions(1);
        renderer.render(<Fetch_1.Fetch loader={fn} url="https://api.github.com/users/octocat" render={function () { return null; }}/>);
        expect(fn).toHaveBeenCalled();
    });
    it("should propagate `store` correctly", function () {
        expect.assertions(1);
        var context = { api: "https://api.github.com", store: { cats: 42 } };
        var expectedData = {
            cats: 42,
        };
        var receivedData;
        react_test_renderer_1.default.create(<index_1.FetchProvider value={context}>
        <index_1.Fetch resultOnly path="store" onFetch={function (data) { return (receivedData = data || null); }}/>
      </index_1.FetchProvider>);
        expect(receivedData).toMatchObject(expectedData);
    });
    it("should throw when it is not rendered in the context of a <FetchProvider>", function () {
        expect.assertions(1);
        expect(function () {
            return renderer.render(<Fetch_1.Fetch path="store">{function () { return null; }}</Fetch_1.Fetch>);
        }).toThrow();
    });
    it("should throw when no `url` nor `path` is passed", function () {
        expect.assertions(1);
        expect(function () { return renderer.render(<Fetch_1.Fetch>{function () { return null; }}</Fetch_1.Fetch>); }).toThrow();
    });
    it("should throw when `onTimeout` is passed, but no `timeout`", function () {
        expect.assertions(1);
        expect(function () {
            return renderer.render(<Fetch_1.Fetch url="https://api.github.com/users/octocat" onTimeout={function () { return fn(); }}>
          {function () { return null; }}
        </Fetch_1.Fetch>);
        }).toThrow();
    });
    it("should throw when no `children`, `component`, `onFetch`, `render` prop is passed", function () {
        expect.assertions(1);
        expect(function () {
            return renderer.render(<Fetch_1.Fetch url="https://api.github.com/users/octocat"/>);
        }).toThrow();
    });
});
