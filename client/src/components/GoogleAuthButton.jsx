import { GoogleLogin } from "@react-oauth/google";
import api from "../api/api";

const googleAuthEndpoint =
  import.meta.env.VITE_GOOGLE_AUTH_ENDPOINT || "/auth/google-login";

export default function GoogleAuthButton({
  onSuccessRedirect,
  onErrorMessage,
  setError,
  setLoading,
}) {
  const handleGoogleSuccess = async (credentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      setError?.("Credential Google tidak ditemukan. Silakan coba lagi.");
      return;
    }

    setError?.("");
    setLoading?.(true);

    try {
      const { data } = await api.post(googleAuthEndpoint, { credential });
      const accessToken = data.access_token;

      if (!accessToken) {
        throw new Error("Access token tidak ditemukan.");
      }

      localStorage.setItem("access_token", accessToken);
      onSuccessRedirect?.();
    } catch (err) {
      setError?.(
        err.response?.data?.message ||
          onErrorMessage ||
          "Login Google gagal, silakan coba lagi.",
      );
    } finally {
      setLoading?.(false);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        setError?.(onErrorMessage || "Login Google gagal, silakan coba lagi.");
        setLoading?.(false);
      }}
      useOneTap={false}
      theme="outline"
      text="continue_with"
      shape="pill"
      size="large"
      width="320"
    />
  );
}
