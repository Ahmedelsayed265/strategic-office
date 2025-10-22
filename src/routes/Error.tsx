import { Link, useRouteError, isRouteErrorResponse } from "react-router";

export default function Error() {
  const error = useRouteError();

  const getErrorDetails = () => {
    if (isRouteErrorResponse(error)) {
      return {
        status: error.status,
        title: error.status === 404 ? "Page Not Found" : "Application Error",
        message:
          error.status === 404
            ? "Sorry, the page you are looking for does not exist."
            : "An unexpected application error has occurred. Please try again later.",
      };
    }

    if (error instanceof Error) {
      return {
        status: 500,
        title: "Application Error",
        message:
          "An unexpected application error has occurred. Please try again later.",
      };
    }

    return {
      status: 500,
      title: "Unexpected Error",
      message:
        "Something went wrong. Please refresh the page or try again later.",
    };
  };

  const { status, title, message } = getErrorDetails();

  return (
    <>
      <title>
        {status === 500 ? "500 Application Error" : "404 Page Not  Found"}
      </title>

      <div className="bg-gray-100 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center p-6">
          <img
            src="/icons/error.png"
            alt={`Error ${status}`}
            className="w-96 h-96 object-contain"
          />

          <h1 className="text-3xl font-bold text-black mb-3">
            Oops! {title} ({status})
          </h1>

          <p className="text-sm text-gray-600 mb-4">{message}</p>

          <Link to="/" className="btn_basic rounded-full shadow-md px-8">
            Back Home
          </Link>
        </div>
      </div>
    </>
  );
}
