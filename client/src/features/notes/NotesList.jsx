import Note from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery();

  let content;

  if (isLoading) content = <p>Loading...</p>;
  if (isError) <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids } = notes;

    const tableContent = ids?.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null;

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
