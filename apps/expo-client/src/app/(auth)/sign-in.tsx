import { SignInScreenComponent } from "@/components/Auth";
import { ScrollViewWrapper } from "@/ui";
import React from "react";

const SignInScreen = () => {
  return (
    <ScrollViewWrapper>
      <SignInScreenComponent />
    </ScrollViewWrapper>
  );
};

export default SignInScreen;
