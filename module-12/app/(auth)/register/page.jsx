import { requireUnAuth } from "@/lib/auth-utils";
import { RegisterForm } from "@/modules/auth/components/sign-up-form";

const Page = async () => {
  await requireUnAuth();

  return <RegisterForm />;
};

export default Page;
