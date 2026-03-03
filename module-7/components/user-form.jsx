import { createUser } from "@/actions";

const UserForm = () => {
  return (
    <form action={createUser}>
      <input name="name" placeholder="John Doe" />
      <button type="submit">Create</button>
    </form>
  );
};

export default UserForm;
