import Link from "next/link";

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link href={"/profile"}>Go to profile</Link>
    </div>
  );
};

export default DashboardPage;
