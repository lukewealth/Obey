export const metadata = {
  name: "Tradewith Obey Node",
  description: "A high-fidelity digital financial platform featuring airtime and data modules, a gift card marketplace, cryptocurrency exchange, multi-asset wallet system, identity verification, onboarding, and an admin monitoring dashboard.",
  version: "4.0.0-STABLE",
  founder: "Tradewith Obey Node",
  contact: "contact@tricode.pro",
  security: "AES-256 Bit Encryption",
  compliance: ["SOC2 Type II", "GDPR", "KYC/AML"],
};

export const getWebsiteConfig = {
  auth: {
    google: {
      url: "https://okweyoxpmdkmkvwehayp.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Fobey-kappa.vercel.app",
      updateIcon: false,
    },
    apple: {
      enabled: true,
      updateIcon: false,
    },
    preferFirebase: true,
    fallbackToSupabase: true
  }
};
