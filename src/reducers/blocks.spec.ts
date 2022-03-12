import mockFetch from "cross-fetch";
import reducer from "./blocks";
import { Node } from "../types/Node";
import initialState from "./initialState";
import { Blocks } from '../types/Block';
import { fetchBlocks } from './blocks';

jest.mock("cross-fetch");

const mockedFech: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Blocks", () => {
  const getInitialState = () => {
    return initialState().blocks;
  };

  const block: Blocks = {
    list: [],
    error: false,
    loading: false,
  }

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle fetchBlocks.pending", () => {
    const appState = block;
    const action = { type: fetchBlocks.pending };
    const expected = {
      list: [],
      error: false,
      loading: true,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchBlocks.fulfilled", () => {
    const appState = block;
    const action = {
      type: fetchBlocks.fulfilled,
      payload: {
        data: [
          { attributes: { index: 1, data: 'delta' }},
          { attributes: { index: 2, data: 'alpha' }},
        ]
      },
    };
    const expected = {
      list: [
        { index: 1, data: 'delta' },
        { index: 2, data: 'alpha' }
      ],
      error: false,
      loading: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchBlocks.rejected", () => {
    const appState = {
      list: [
        { index: 1, data: 'delta' },
        { index: 2, data: 'alpha' }
      ],
      error: false,
      loading: false,
    };
    const action = { type: fetchBlocks.rejected };
    const expected = {
      list: [],
      error: true,
      loading: false,
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Actions::Blocks", () => {
  const dispatch = jest.fn();

  afterAll(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });

  const node: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
  };

  it("should fetch the blocks", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({
            data: [
              { attributes: { index: 1, data: 'delta' }},
              { attributes: { index: 2, data: 'alpha' }},
            ]
          });
        },
      })
    );
    await fetchBlocks(node)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([

      expect.objectContaining({
        type: fetchBlocks.fulfilled.type,
        payload: {
          data: [
            { attributes: { index: 1, data: 'delta' }},
            { attributes: { index: 2, data: 'alpha' }},
          ]
        },
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
