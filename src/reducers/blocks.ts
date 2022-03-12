import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Node } from "../types/Node";
import { RootState } from "../store/configureStore";
import fetch from "cross-fetch";
import { Blocks as BlocksState, BlocksData } from "../types/Block";

export const fetchBlocks = createAsyncThunk(
  "blocks/fetchBlocks",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const data = await response.json();
    return data;
  }
);

export const blocksSlice = createSlice({
  name: "blocks",
  initialState: initialState().blocks as BlocksState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBlocks.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchBlocks.fulfilled, (state, action) => {
      if (action.payload?.data) {
        let blocksList: BlocksData[] = [];
        action.payload.data.map((blocks: any) => {
          return blocksList.push({
            index: blocks.attributes.index,
            data: blocks.attributes.data
          });
        });
        state.list = blocksList;
        state.loading = false;
        state.error = false;
      }
    });
    builder.addCase(fetchBlocks.rejected, (state) => {
      state.list = [];
      state.loading = false;
      state.error = true;
    });
  },
});

export const selectBlocks = (state: RootState) => state.blocks;
export default blocksSlice.reducer;
