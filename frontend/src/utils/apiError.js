export function getApiErrorMessage(error, fallbackMessage) {
  if (!error.response) {
    return "Backend is not reachable. Make sure Django is running on http://127.0.0.1:8000.";
  }

  const { status, data } = error.response;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.errors?.email?.[0]) {
    return data.errors.email[0];
  }

  if (data?.errors?.password?.[0]) {
    return data.errors.password[0];
  }

  if (data?.errors?.full_name?.[0]) {
    return data.errors.full_name[0];
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.email?.[0]) {
    return data.email[0];
  }

  if (data?.password?.[0]) {
    return data.password[0];
  }

  if (data?.full_name?.[0]) {
    return data.full_name[0];
  }

  if (status === 400) {
    return "Please check your input. Use a new email and a password with at least 8 characters.";
  }

  if (status === 401) {
    return "Invalid email or password.";
  }

  if (status >= 500) {
    return "The server hit an error. Please try again in a moment.";
  }

  return fallbackMessage;
}
