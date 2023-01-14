import Note from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesLists", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th className="table__th note__status" scope="col">
              Status
            </th>
            <th className="table__th note__created" scope="col">
              Created
            </th>
            <th className="table__th note__updated" scope="col">
              Updated
            </th>
            <th className="table__th note__title" scope="col">
              Title
            </th>
            <th className="table__th note__username" scope="col">
              Owner
            </th>
            <th className="table__th note__edit" scope="col">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default NotesList;
