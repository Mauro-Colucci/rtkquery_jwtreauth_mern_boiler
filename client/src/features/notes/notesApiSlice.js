import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

//normalized state
const noteAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = noteAdapter.getInitialState();

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //sets the cache for 5s, for dev testing purposes. default is 60s
      keepUnusedDataFor: 5,
      //normalized data uses the id property, so we have to change the _id one that comes from mongo
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return noteAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "note", id })),
          ];
        } else return [{ type: "note", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetNotesQuery } = noteApiSlice;

//returns the query result object
export const selectNoteResult = noteApiSlice.endpoints.getNotes.select();

//creates memoized selector
const selectNoteData = createSelector(
  selectNoteResult,
  (noteResult) => noteResult.data //normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  //pass in a selector that returns the notes slice of state
} = noteAdapter.getSelectors((state) => selectNoteData(state) ?? initialState);
