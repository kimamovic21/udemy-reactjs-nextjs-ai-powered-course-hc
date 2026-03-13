"use client";

import { useUser } from "@clerk/nextjs";

const ClientPage = () => {
  const user = useUser();

  return (
    <div>
      ClientPage
      {JSON.stringify(user)}
    </div>
  );
};

export default ClientPage;
