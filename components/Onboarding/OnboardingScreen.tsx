import { useState } from "react";
import OnboardingOne from "@/app/personalData";
import OnboardingTwo from "@/app/healthData";
import OnboardingThree from "@/app/healthHistoryData";


const OnboardingScreen = () => {
    const [onboardingFlag, setOnboardingFlag] = useState<Number>(0);

    console.log("signupFlag: ", onboardingFlag);

    return onboardingFlag === 0 ? (
      
        <OnboardingOne setOnboardingFlag={setOnboardingFlag} />
        // <OnboardingThree setOnboardingFlag={setOnboardingFlag} />
        // <OnboardingTwo setOnboardingFlag={setOnboardingFlag}/>
    ) : onboardingFlag === 1 ? (
      <OnboardingTwo setOnboardingFlag={setOnboardingFlag}/>
    ) : (
        <OnboardingThree setOnboardingFlag={setOnboardingFlag} />
    );
};

export default OnboardingScreen;
