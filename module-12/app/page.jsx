import { requireAuth } from "@/lib/auth-utils";
import { getCurrentDbUser } from "@/modules/auth/actions";
import { authClient } from "@/lib/auth-client";
import { polarClient } from "@/modules/polar/config/polar";
import { getCurrentRazorpayStatus } from "@/modules/razorpay/action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SuccessToast } from "@/modules/stripe/components/success-toast";
import LogoutButton from "@/modules/auth/components/logout-button";
import StripeComponent from "@/modules/stripe/components/stripe-component";
import PolarComponent from "@/modules/polar/components/polar-component";
import RazorpayComponent from "@/modules/razorpay/components/razorpay-component";

export default async function Home({ searchParams }) {
  const { success, canceled } = await searchParams;
  await requireAuth();
  const user = await getCurrentDbUser();

  const customer = await polarClient.customers.getStateExternal({
    externalId: user.id,
  });

  const hasActivePolarSubscription =
    customer?.activeSubscriptions && customer.activeSubscriptions.length > 0;

  console.log({ hasActivePolarSubscription, customer });

  const razorpayPlan = await getCurrentRazorpayStatus();

  console.log({ razorpayPlan });

  return (
    <main className="flex flex-col items-center justify-center px-4 py-12">
      <SuccessToast
        success={success === "true"}
        canceled={canceled === "true"}
      />

      <Tabs defaultValue="stripe">
        <TabsList>
          <TabsTrigger value="stripe">Stripe🟣</TabsTrigger>
          <TabsTrigger value="polar">Polar🟢</TabsTrigger>
          <TabsTrigger value="razorpay">Razorpay🔵</TabsTrigger>
        </TabsList>
        <TabsContent value="stripe">
          <StripeComponent plan={user?.plan} />
        </TabsContent>
        <TabsContent value="polar">
          <PolarComponent isPro={hasActivePolarSubscription} />
        </TabsContent>
        <TabsContent value="razorpay">
          <RazorpayComponent currentPlan={razorpayPlan} />
        </TabsContent>
      </Tabs>
      <LogoutButton />
    </main>
  );
}
