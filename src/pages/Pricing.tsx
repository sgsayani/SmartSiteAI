import React from "react";
import { appPlans } from "../assets/assets";
import Footer from "../components/Footer";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import api from "@/configs/axios";

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const {data: session} = authClient.useSession()
  const [plans] = React.useState<Plan[]>(appPlans);
  
  const handlePurchase = async (planId: string) => {
    try {
      if(!session?.user) return toast('Please login to purchase credits')
        const {data} = await api.post('/api/user/purchase-credits',{planId})
        window.location.href = data.payment_link;
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error?.message)
      console.log(error);
      
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto max-md:px-4 min-h-[80vh]">
        {/* Header */}
        <div className="text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-semibold cyber-glow-text">
            Choose your plan
          </h2>
          <p className="text-sm md:text-base max-w-md mx-auto mt-3 opacity-70">
            Start for free and scale up as you grow. Find the perfect plan for
            your content creation needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pt-14 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="cyber-price-card mx-auto w-full max-w-sm p-6 rounded-xl"
              >
                {/* Plan name */}
                <h3 className="text-xl font-semibold cyber-glow-text">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="my-4">
                  <span className="text-4xl font-bold cyber-glow-text">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm opacity-70">
                    / {plan.credits} credits
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm mb-6 opacity-70">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="cyber-check">✓</span>
                      <span className="opacity-80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="cyber-btn w-full py-2.5 rounded-md text-sm font-medium"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="mx-auto text-center text-sm max-w-md mt-10 opacity-70">
          Project{" "}
          <span className="cyber-glow-text font-medium">
            Creation / Revision
          </span>{" "}
          consumes{" "}
          <span className="cyber-glow-text font-medium">
            5 credits
          </span>
          . You can purchase more credits to create more projects.
        </p>
      </div>

      <Footer />
    </>
  );
};

export default Pricing;
