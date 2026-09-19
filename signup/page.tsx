// src/app/login/page.tsx
import { Suspense } from "react";
import AuthForm from "../AuthForm";

export const metadata = { title: "Sign in · Pixel Journal" };

// AuthForm reads ?next= via useSearchParams, which forces client rendering.
// Without a boundary the whole route bails out of prerendering at build time.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
