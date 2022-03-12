import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import nodesReducer, { checkNodeStatus, NodesState } from "../reducers/nodes";
import blocksReducer, { fetchBlocks } from "../reducers/blocks";
import { Blocks as BlocksState } from "../types/Block";

describe("Store", () => {
  const nodes = {
    list: [
      { url: "a.com", online: false, name: "", loading: false },
      { url: "b.com", online: false, name: "", loading: false },
      { url: "c.com", online: false, name: "", loading: false },
      { url: "d.com", online: false, name: "", loading: false },
    ],
  };

  const blocks = {
    list: [],
    error: false,
    loading: false,
  }

  let store: EnhancedStore<
    { nodes: NodesState, blocks: BlocksState },
    AnyAction,
    [
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, null>
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, undefined>
      | ThunkMiddleware<{ blocks: BlocksState }, AnyAction, null>
      | ThunkMiddleware<{ blocks: BlocksState }, AnyAction, undefined>
    ]
  >;

  beforeAll(() => {
    store = configureStore({
      reducer: {
        nodes: nodesReducer,
        blocks: blocksReducer,
      },
      preloadedState: { nodes, blocks },
    });
  });
  afterAll(() => {});

  it("should display results when necessary data is provided", () => {
    const actions = [
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "alpha" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "beta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "gamma" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[2] },
        payload: { node_name: "delta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "epsilon" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "zeta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "eta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "theta" },
      },
    ];
    actions.forEach((action) => store.dispatch(action));

    const actual = store.getState();
    const expected = {
      list: [
        { url: "a.com", online: true, name: "theta", loading: false },
        { url: "b.com", online: true, name: "epsilon", loading: false },
        { url: "c.com", online: true, name: "delta", loading: false },
        { url: "d.com", online: false, name: "", loading: false },
      ],
    };

    expect(actual.nodes).toEqual(expected);
  });

  it("should display results when necessary data is provided for blocks", () => {
    const actions = [
      {
        type: fetchBlocks.fulfilled.type,
        payload: {
          data: [
            { attributes: { index: 1, data: 'delta' }},
            { attributes: { index: 2, data: 'alpha' }},
          ]
        },
      }
    ];
    actions.forEach((action) => store.dispatch(action));

    const actual = store.getState();
    const expected = {
      list: [
        { index: 1, data: 'delta' },
        { index: 2, data: 'alpha' },
      ],
      error: false,
      loading: false,
    };

    expect(actual.blocks).toEqual(expected);
  });
});
