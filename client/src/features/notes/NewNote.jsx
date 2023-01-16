import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const NewNote = () => {
  useTitle("COMPANY: New Note");

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color="#FFF" />;
  return <NewNoteForm users={users} />;
};
export default NewNote;
