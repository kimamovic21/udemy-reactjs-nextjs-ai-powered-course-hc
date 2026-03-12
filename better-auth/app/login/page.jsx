import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/login-form";

const LoginPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/");
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
