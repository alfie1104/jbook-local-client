import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  data: {},
  loading: false,
  error: null,
  order: [],
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return;
    case ActionType.DELETE_CELL:
      return;
    case ActionType.MOVE_CELL:
      return;
    case ActionType.INSERT_CELL_BEFORE:
      return;
    default:
      return;
  }
});

export default reducer;
