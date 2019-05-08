"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var shallow_1 = require("react-test-renderer/shallow");
var index_1 = require("../index");
describe("A <FetchProvider />", function () {
    var fn;
    var renderer;
    beforeEach(function () {
        fn = jest.fn();
        renderer = shallow_1.createRenderer();
    });
    afterEach(function () { return jest.clearAllMocks(); });
    it("should render component children correctly", function () {
        expect.assertions(1);
        var component = react_test_renderer_1.default.create(<index_1.FetchProvider value={{
            api: "https://api.github.com",
            headers: {
                "X-Nyan-Token": "superNyan",
            },
        }}>
        <index_1.Fetch path="/users/octocat">
          <div />
        </index_1.Fetch>
      </index_1.FetchProvider>);
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("should propagate `store` correctly", function () {
        expect.assertions(1);
        var context = { api: "https://api.github.com", store: { cats: 42 } };
        var expectedData = {
            data: { cats: 42 },
            isOK: true,
        };
        var onFetch = function (data) { return (receivedData = data || null); };
        var receivedData;
        var component = react_test_renderer_1.default.create(<index_1.FetchProvider value={context}>
        <index_1.Fetch path="store" onFetch={onFetch}/>
      </index_1.FetchProvider>);
        expect(receivedData).toMatchObject(expectedData);
    });
});
