import { useRouter } from "next/router";

export default function ErrorFallBack({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: any;
}) {
  const router = useRouter();
  return (
    <h1 className=" text-5xl">
      You are unable to acess this please mail to admin in footer...
      <p
        className="underline hover:text-blue-400 hover:decoration-blue-400"
        onClick={() => {
          resetErrorBoundary();
          router.replace("/");
        }}
      >
        Go Home
      </p>
    </h1>
  );
}
