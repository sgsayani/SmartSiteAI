import React from "react";
import { appPlans } from "../assets/assets";
import Footer from "../components/Footer";

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const [plans] = React.useState<Plan[]>(appPlans);
  const handlePurchase = async (planId: string) => {};

  return (
    <>
      <div className="w-full max-w-6xl mx-auto max-md:px-4 min-h-[80vh]">
        {/* Header */}
        <div className="text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] dark:text-slate-100">
            Choose your plan
          </h2>
          <p className="text-sm md:text-base max-w-md mx-auto mt-3 text-[#64748B] dark:text-slate-400">
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
                className="
                  mx-auto w-full max-w-sm p-6 rounded-xl
                  bg-[#FFFFFF] dark:bg-white/5
                  border border-[#E2E8F0] dark:border-white/10
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1 
                "
              >
                {/* Plan name */}
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-slate-100">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="my-4">
                  <span className="text-4xl font-bold text-[#0F172A] dark:text-slate-100">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm text-[#64748B] dark:text-slate-400">
                    / {plan.credits} credits
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm mb-6 text-[#64748B] dark:text-slate-400">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-[#4F46E5] dark:text-[#22D3EE] mr-2 mt-[2px]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-[#64748B] dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="
                    w-full py-2.5 rounded-md text-sm font-medium
                    text-white
                    bg-gradient-to-r bg-blue-700 dark:bg-blue-600
                    hover:from-[#4338CA] hover:to-[#4F46E5]
                    active:scale-[0.97]
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50
                    dark:shadow-[0_0_18px_rgba(34,211,238,0.25)]
                  "
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="mx-auto text-center text-sm max-w-md mt-10 text-[#64748B] dark:text-slate-400">
          Project{" "}
          <span className="text-[#0F172A] dark:text-slate-100 font-medium">
            Creation / Revision
          </span>{" "}
          consumes{" "}
          <span className="text-[#0F172A] dark:text-slate-100 font-medium">
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
