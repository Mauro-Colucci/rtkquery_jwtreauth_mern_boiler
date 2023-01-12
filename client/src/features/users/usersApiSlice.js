import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

//normalized state
const userAdapter = createEntityAdapter({});

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //sets the cache for 5s, for dev testing purposes. default is 60s
      keepUnusedDataFor: 5,
      //normalized data uses the id property, so we have to change the _id one that comes from mongo
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return userAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetUsersQuery } = userApiSlice;

//returns the query result object
export const selectUserResult = userApiSlice.endpoints.getUsers.select();

//creates memoized selector
const selectUserData = createSelector(
  selectUserResult,
  (userResult) => userResult.data //normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  //pass in a selector that returns the users slice of state
} = userAdapter.getSelectors((state) => selectUserData(state) ?? initialState);
